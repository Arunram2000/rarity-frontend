import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Button, Textfield } from "../../components";
import { addCollectionApi } from "../../api";

const initialvalues = {
  email: "",
  collection_name: "",
  collection_url: "",
  website_url: "",
  official_twitter_url: "",
  official_discord_url: "",
  collection_contract_address: "",
  description: "",
  marketplace_url: "",
};

const Register: React.FC = () => {
  const [chain, setChain] = useState("eth");
  const [image, setImage] = useState<any>(null);
  const [bannerImage, setBannerImage] = useState<any>(null);
  const [error, setError] = useState({ bannerImage: false, image: false });

  const baseSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    collection_name: Yup.string().required("Collection name is required"),
    collection_url: Yup.string().required("Collection URL is required"),
    website_url: Yup.string().url("Invalid url link"),
    official_twitter_url: Yup.string().url("Invalid url link"),
    official_discord_url: Yup.string().url("Invalid url link"),
  });

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    collection_name: Yup.string().required("Collection name is required"),
    website_url: Yup.string().url("Invalid url link"),
    marketplace_url: Yup.string().url("Invalid url link").required("marketplace URL is required"),
    official_twitter_url: Yup.string().url("Invalid url link"),
    official_discord_url: Yup.string().url("Invalid url link"),
    description: Yup.string().required("description is required"),
    collection_contract_address: Yup.string().required("contract address is required"),
  });

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    if (chain !== "eth" && !image) return setError({ ...error, image: true });
    if (chain !== "eth" && !bannerImage) return setError({ ...error, bannerImage: true });

    const finalValues = {
      ...values,
      banner_image_url: bannerImage,
      image_url: image,
      chain,
    };

    try {
      const { data } = await addCollectionApi(finalValues);
      if (data?.error === true) {
        alert(data?.message);
        setSubmitting(false);
        resetForm();
        return;
      }
      alert("your collection is submitted  successfully ,your collection will be live soon");
      setSubmitting(false);
      resetForm();
      setImage(null);
      setBannerImage(null);
    } catch (error) {
      console.log(error);
      alert("something went wrong try again after some time");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChain(e.target.value);
  };

  return (
    <div>
      <Formik
        initialValues={initialvalues}
        onSubmit={handleSubmit}
        validationSchema={chain === "eth" ? baseSchema : validationSchema}
      >
        {(props) => (
          <Form>
            <div className="form">
              <Textfield label="Email *" name="email" type="email" />
              <Textfield label="Collection Name" name="collection_name" />
              {chain === "eth" && <Textfield label="Collection URL" name="collection_url" />}
              <Textfield label="Website URL" name="website_url" />
              <Textfield label="Official Twitter URL" name="official_twitter_url" />
              <Textfield label="Official Discord URL" name="official_discord_url" />

              <div className="form_group">
                <label>Collection of blockchain</label>
                <div className="radio_group">
                  <p>
                    <input
                      type="radio"
                      name="chain"
                      value="eth"
                      defaultChecked
                      onChange={handleChange}
                    />
                    <span>Ethereum</span>
                  </p>
                  <p>
                    <input type="radio" name="chain" value="polygon" onChange={handleChange} />
                    <span>Matic</span>
                  </p>
                  <p>
                    <input type="radio" name="chain" value="bsc" onChange={handleChange} />
                    <span>Binance Smart Chain</span>
                  </p>
                  <p>
                    <input type="radio" name="chain" value="avalanche" onChange={handleChange} />
                    <span>Avalanche</span>
                  </p>
                </div>
              </div>
              {chain !== "eth" && (
                <>
                  <Textfield label="Description" name="description" />
                  <Textfield label="Marketplace url" name="marketplace_url" />
                  <Textfield
                    label="Collection Contract address"
                    name="collection_contract_address"
                  />
                  <div className="image_input">
                    {image ? (
                      <>
                        <img src={image} alt="profile" />
                        <Button onClick={() => setImage(null)}>cancel</Button>
                      </>
                    ) : (
                      <>
                        <label htmlFor="image_url">
                          <b>Upload image</b>
                        </label>
                        <input
                          type="file"
                          id="image_url"
                          name="image_url"
                          multiple={false}
                          accept=".png,.jpg,.gif,.jpeg"
                          onChange={async (e) => {
                            const files = e.target.files;
                            if (files?.[0]) {
                              if (files[0].size > 2 * 1024 * 1024) {
                                alert("max size is 2mb");
                                return;
                              }
                              var reader = new FileReader();
                              reader.readAsDataURL(files[0]);

                              reader.onload = function () {
                                setImage(reader.result);
                                setError({ ...error, image: false });
                              };
                              reader.onerror = function (error) {
                                console.log("Error: ", error);
                              };
                            }
                          }}
                        />
                        <p className="error_input">file types jpg,jpeg,png and gif</p>
                      </>
                    )}
                    {error.image && (
                      <p className="error_input">
                        <b>choose image to proceed</b>
                      </p>
                    )}
                  </div>
                  <div className="image_input">
                    {bannerImage ? (
                      <>
                        <img src={bannerImage} alt="profile" />
                        <Button onClick={() => setBannerImage(null)}>cancel</Button>
                      </>
                    ) : (
                      <>
                        <label htmlFor="banner_image_url">
                          <b>Upload Banner image</b>
                        </label>
                        <input
                          type="file"
                          id="banner_image_url"
                          name="banner_image_url"
                          multiple={false}
                          accept=".png,.jpg,.gif,.jpeg"
                          onChange={async (e) => {
                            const files = e.target.files;
                            if (files?.[0]) {
                              if (files[0].size > 2 * 1024 * 1024) {
                                alert("max size is 2mb");
                                return;
                              }
                              var reader = new FileReader();
                              reader.readAsDataURL(files[0]);

                              reader.onload = function () {
                                setBannerImage(reader.result);
                                setError({ ...error, bannerImage: false });
                              };
                              reader.onerror = function (error) {
                                console.log("Error: ", error);
                              };
                            }
                          }}
                        />
                        <p className="error_input">file types jpg,jpeg,png and gif</p>
                      </>
                    )}
                    {error.bannerImage && <p className="error_input">choose image to proceed</p>}
                  </div>
                </>
              )}
              <div>
                <Button type="submit" style={{ padding: "7px 1em" }}>
                  Register
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
