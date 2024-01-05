const multer = require("multer");
const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode");
const axios = require("axios");
const uuid = require("uuid").v4();
// const paystack = require('paystack')(process.env.paystack_secret_key);
const Flutterwave = require("flutterwave-node-v3");
const Subscription = require("../../models/vendor/Subscription");
const { findStore, createStore } = require("../../services/vendor/store");
const {
  addProduct,
  removeProduct,
  fetchProduct,
} = require("../../services/vendor/product");

const {
  fetchVendor,
  vendorById,
  updateVendor,
  updateVendorById,
} = require("../../services/vendor/vendor");
const logger = require("../../logger/index");

const log = logger.child({
  id: uuid,
});

// VENDOR DASHBOARD
const dashboard = async (req, res) => {
  try {
    const vendor = await vendorById(req.user.id);
    if (vendor) {
      const { password, ...data } = vendor._doc;
      return res.status(200).json(data);
    } else {
      return res.status(403).json({
        message: "Oops something went wrong but we are working on it...",
        error: 403,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Server error: something went wrong, please try again later",
      error: err,
    });
  }
};

// PRODUCT PREVIEW FUNCTION
const productsPreview = async (req, res) => {
  try {
    const vendor = await vendorById(req.user.id);
    if (vendor) {
      const vendorProducts = await fetchProduct({ vendorId: req.user.id });
      return res.status(200).json(vendorProducts);
    } else {
      return res.status(403).json({
        message: "Action rejected...",
        error: 403,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Server error: something went wrong, please try again later",
      error: err,
    });
  }
};

// STORE SETUP FOR FUNCTION
const create_store = async (req, res) => {
  try {
    const vendor = await vendorById(req.user.id);
    if (vendor) {
      const store = await findStore({ name: req.body.name });
      if (store) {
        return res.status(403).json({
          message: "Oops sorry store name already taken...",
          error: 403,
        });
      } else {
        const storage = multer.diskStorage({
          destination: `./public/images/store-logos`,
          filename: (req, file, cb) => {
            cb(
              null,
              file.fieldname +
                "_" +
                Date.now() +
                path.extname(file.originalname)
            );
          },
        });

        const storeUpload = multer({
          storage,
          fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
              res
                .status(403)
                .json({ error_msg: "Only .jpg and .png files allowed..." });
            } else {
              cb(null, true);
            }
          },
        }).single("image");

        storeUpload(req, res, async (err) => {
          if (err) {
            return res.status(500).json({ message: err });
          } else {
            const newStore = await createStore({
              vendorId: vendor.id,
              name: req.body.name,
              // image: req.file.filename,
              desc: req.body.desc,
            });

            const store = await newStore.save();

            await updateVendorById(
              { _id: vendor.id },
              {
                $set: {
                  store_id: store.id,
                },
              },
              { new: true }
            );

            res.status(200).json({
              message: "Store is successfully created...",
              request: {
                type: "GET",
                destination: "PREVIEW USER STORE",
                url: `${store.name}.localhost:5000`,
              },
            });
          }
        });
      }
    } else {
      res
        .status(403)
        .json({ message: "to create a store, account creation most be made." });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Server error: something went wrong, please try again later",
      error_message: err.message,
    });
  }
};

// PRODUCT UPLOAD...
const uploadVendorProduct = async (req, res) => {
  const vendorId = req.user.id;
  const vendor = await vendorById(vendorId);
  try {
    if (!vendor) {
      res
        .status(403)
        .json({ message: "something went wrong invalid vendor id" });
    } else {
      const store = await findStore({ _id: vendor.store_id });
      const storage = multer.diskStorage({
        destination: `./public/vendors-store-files/${store.name}/product-imgs`,
        filename: (req, file, cb) => {
          cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
          );
        },
      });

      const product = multer({
        storage,
        fileFilter: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
            res
              .status(403)
              .json({ message: "Only .jpg or .png files allowed..." });
          } else {
            cb(null, true);
          }
        },
      }).single("image");

      product(req, res, async (err) => {
        if (err) {
          res.status(500).json({ error_msg: err.message });
        } else {
          const {
            title,
            desc,
            image,
            categories,
            available_sizes,
            available_colors,
            price,
          } = req.body;
          const newProduct = await addProduct({
            vendorId,
            title,
            desc,
            image: req.file.filename,
            categories,
            available_colors,
            available_sizes,
            price,
          });
          const createdProduct = await newProduct.save();
          if (!vendor.products.includes(createdProduct.id)) {
            await Vendor.updateOne({ $push: { products: createdProduct.id } });
            res.status(201).json({
              message: "Product successfully uploaded...",
            });
          } else {
            return res.status(403).json({
              message: "Product can only be upload once...",
              error: 403,
            });
          }
        }
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PRODUCT DELETE...
const deleteProduct = async (req, res) => {
  try {
    const vendor = await vendorById(req.user.id);
    if (vendor) {
      const product = await removeProduct(req.params.id);
      const store = await findStore({ _id: vendor.store_id });
      fs.stat(path.join(), (err) => {
        if (err) {
          return res.status(404).json({
            message: "file not found..",
            error: err.message,
          });
        } else {
          fs.unlink(
            path.join(
              __dirname,
              `../../../public/vendors-store-files/${store.name}/product-imgs/${product.image}`
            ),
            async (err) => {
              if (err) {
                return res.status(404).json({
                  message: err.message,
                });
              } else {
                await removeProduct(req.params.id);
                // REMOVE PRODUCT FROM VENDOR SCHEMA
                if (vendor.products.includes(req.params.id)) {
                  await updateVendor({
                    $pull: { products: req.params.id },
                  });
                  return res
                    .status(200)
                    .json({ message: "Product successfully deleted..." });
                } else {
                  return res.status(404).json({
                    message: "Product not found...",
                  });
                }
              }
            }
          );
        }
      });
    } else {
      return res.status(406).json({
        message: "method not allowed...",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Server error: something went wrong, please try again later",
      error: err,
    });
  }
};

// const verify_subscription = async (req, res) => {
//   try {
//     const vendorId = req.user.id;
//     const vendor = await Vendor.findById(vendorId);
//     if (vendor) {
//       //  validate the vendor subscription plan
//     } else {
//       return res.status(403).json({
//         message: "Invalid user",
//       });
//     }
//   } catch (err) {
//     return res.status(500).json({
//       message: "Server error: something went wrong, please try again later",
//       error: err.message,
//     });
//   }
// };

const subscription_plan = async (req, res) => {
  const { card_number, cvv, expiry_month, expiry_year, currency, plan } =
    req.body;
  try {
    const vendor = vendorById(req.user.id);
    if (vendor) {
      const subscription = await Subscription.find({
        vendorId: vendor.id,
        plan_type: plan,
      });
      if (subscription.plan_type === plan) {
        return res.status(406).json({
          message: `you are already on the ${plan} subscription plan`,
        });
      }
      // HANDLY PAYMENT PLAN TYPE
      let plan_code;
      switch (plan) {
        case "weekly":
          plan_code = 31634;
          break;
        case "monthly":
          plan_code = 32466;
          break;
        case "yearly":
          plan_code = 32467;
          break;
      }

      // const tx_ref_code = uuid;

      // const flw = new Flutterwave(
      //   process.env.FLW_PUBLIC_KEY,
      //   process.env.FLW_SECRET_KEY
      // );
      // const payload = {
      //   fullname: `${vendor.firstname} ${vendor.lastname}`,
      //   card_number,
      //   cvv,
      //   expiry_month,
      //   expiry_year,
      //   currency,
      //   amount: plan,
      //   email: vendor.email,
      //   tx_ref: `wemart-${tx_ref_code}`,
      //   enckey: process.env.FLW_ENCRYPTION_KEY,
      // };

      // const response = await flw.Charge.card(payload);

      const newSubscriptionPlan = new Subscription({
        vendorId: vendor.id,
        plan_type: plan,
        code: plan_code,
        payment_type: "card",
      });

      const sub = await newSubscriptionPlan.save();

      await Vendor.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            subscription_plan: sub.id,
          },
        },
        { new: true }
      );
      return res.status(200).json({
        message: `${plan} subscription plan successfully made!`,
      });
    }
    return res.status(403).json({
      message: "Invalid user id",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error: something went wrong, please try again later",
      error: err.message,
    });
  }
};

// REDERRA LINK
const verifyReferralId = async (req, res) => {
  try {
    const refCode = req.query.ref;
    const vendor = fetchVendor({ referralId: refCode });
    if (vendor) {
      return res.status(200).json(vendor.firstname);
    } else {
      return res.status(404).json({
        message: "ref code not valid!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Server error: something went wrong, please try again later",
      error: err.message,
    });
  }
};

module.exports = {
  create_store,
  uploadVendorProduct,
  productsPreview,
  deleteProduct,
  // verify_subscription,
  subscription_plan,
  verifyReferralId,
  dashboard,
};
