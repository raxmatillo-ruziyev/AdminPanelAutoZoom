import React, { useEffect, useState } from 'react';
import { Button, Flex, Image, message, Table, Modal, Form, Input, Upload, Select, Popconfirm } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


import { Switch } from 'antd';
import { useNavigate } from 'react-router-dom';


const Cars = () => {
  const [form] = Form.useForm();
  const CarsUrl = 'https://autoapi.dezinfeksiyatashkent.uz/api/cars';
  const imageURL = "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [brands, setBrands] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [models, setModels] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [postColor, setPostColor] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [postImage2, setPostImage2] = useState(null);
  const [postImage3, setPostImage3] = useState(null);
  const token = localStorage.getItem("access_token");


const navigate =useNavigate()
const getData = async () => {
  setLoader(true); // Loaderni bu yerda yoqamiz

  try {
    const response = await fetch(CarsUrl);
    const data = await response.json();

    if (token) { // Token va data.data mavjudligini tekshirish
      setData(data.data);
      console.log(data.data[0].car_images[0].image.src);
    } else {
      navigate("/");
    }
  } catch (err) {
    message.error(err.toString());
  } finally {
    setLoader(false); // Loaderni bu yerda o'chiramiz
  }
};



  const fetchDropdownData = async () => {
    try {
      const [brandsRes, citiesRes, categoriesRes, modelsRes, locationsRes] = await Promise.all([
        fetch('https://autoapi.dezinfeksiyatashkent.uz/api/brands').then(res => res.json()),
        fetch('https://autoapi.dezinfeksiyatashkent.uz/api/cities').then(res => res.json()),
        fetch('https://autoapi.dezinfeksiyatashkent.uz/api/categories').then(res => res.json()),
        fetch('https://autoapi.dezinfeksiyatashkent.uz/api/models').then(res => res.json()),
        fetch('https://autoapi.dezinfeksiyatashkent.uz/api/locations').then(res => res.json())
      ]);

      setBrands(brandsRes.data);
      setCities(citiesRes.data);
      setCategories(categoriesRes.data);
      setModels(modelsRes.data);
      setLocations(locationsRes.data);
    } catch (err) {
      message.error('Error fetching dropdown data');
    }
  };

  useEffect(() => {
    getData();
    fetchDropdownData();
  }, []);

  const handleFormSubmit = () => {
    const formData = new FormData();
    formData.append('color', postColor);
    formData.append('brand_id', selectedBrand);
    formData.append('model_id', selectedModel);
    formData.append('category_id', selectedCategory);
    formData.append('location_id', selectedLocation);
    formData.append('city_id', selectedCity);
    formData.append('year', form.getFieldValue('year'));
    formData.append('max_speed', form.getFieldValue('max_speed'));
    formData.append('max_people', form.getFieldValue('max_people'));
    formData.append('transmission', form.getFieldValue('transmission'));
    formData.append('motor', form.getFieldValue('motor'));
    formData.append('drive_side', form.getFieldValue('drive_side'));
    formData.append('petrol', form.getFieldValue('petrol'));
    formData.append('limitperday', form.getFieldValue('limitperday'));
    formData.append('deposit', form.getFieldValue('deposit'));
    formData.append('premium_protection', form.getFieldValue('premium_protection'));
    formData.append('price_in_aed', form.getFieldValue('price_in_aed'));
    formData.append('price_in_usd', form.getFieldValue('price_in_usd'));
    formData.append('price_in_aed_sale', form.getFieldValue('price_in_aed_sale'));
    formData.append('price_in_usd_sale', form.getFieldValue('price_in_usd_sale'));
    formData.append('inclusive', form.getFieldValue('inclusive'));
    formData.append('seconds', form.getFieldValue('seconds'));
    formData.append('cover', postImage3);

    if (postImage) {
      formData.append('images', postImage);
      formData.append('images', postImage2);

    }

    const url = isEditMode ? `${CarsUrl}/${currentCar.id}` : CarsUrl;
    const method = isEditMode ? 'PUT' : 'POST';
    fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        getData();
        setIsModalOpen(false);
        message.success(data.message);
        setPostColor('');
        setPostImage(null);
        setSelectedBrand(null);
        setSelectedModel(null);
        setSelectedCity(null);
        setSelectedCategory(null);
        setSelectedLocation(null);
        form.resetFields();
      })
      .catch(err => console.log(err));
  };

  const deleteData = (id) => {
    fetch(`${CarsUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          getData();
          message.success(data.message);
        } else {
          message.error(data.message);
        }
      })
      .catch(err => message.error(err));
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setCurrentCar(null);
    setPostColor('');
    setPostImage(null);
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedCity(null);
    setSelectedCategory(null);
    setSelectedLocation(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleEdit = (car) => {
    setIsEditMode(true);
    setCurrentCar(car);
    setPostColor(car.color);
    setSelectedBrand(car.brand_id);
    setSelectedModel(car.model_id);
    setSelectedCity(car.city_id);
    setSelectedCategory(car.category_id);
    setSelectedLocation(car.location_id);
    setIsModalOpen(true);
    form.setFieldsValue({
      color: car.color,
      year: car.year,
      max_speed: car.max_speed,
      max_people: car.max_people,
      transmission: car.transmission,
      motor: car.motor,
      drive_side: car.drive_side,
      petrol: car.petrol,
      limitperday: car.limitperday,
      deposit: car.deposit,
      premium_protection: car.premium_protection,
      price_in_aed: car.price_in_aed,
      price_in_usd: car.price_in_usd,
      price_in_aed_sale: car.price_in_aed_sale,
      price_in_usd_sale: car.price_in_usd_sale,
      inclusive: car.inclusive,
      seconds: car.seconds
    });
  };

  const columns = [
    { title: "Id", dataIndex: "index", key: "index" },
    { title: "Color", dataIndex: "color", key: "color" },

    { title: "Brand", dataIndex: "brand", key: "brand" },

    { title: "City", dataIndex: "city", key: "city" },
    { title: "Image", dataIndex: "image", key: "image" },
    { title: "Action", dataIndex: "action", key: "action" },
    {
      title: (
        <Button type="primary" onClick={handleAdd}>
          Add Car
        </Button>
      ),
      dataIndex: "add-car",
      key: "add-car",
    },
  ];


  const dataSource = data.map((car, index) => ({
    index: index + 1,
    key: car.id,
    color: car.color,
    model: car.model.name,
    brand: car.brand.title,
    city: car.city.name,
    image: car.car_images.length > 0 ? (
      <Image width={110} height={100} src={`${imageURL}${car.car_images[0].image.src}`} alt={car.title} />
    ) : (
      <Image width={110} height={100} src={`${imageURL}/default-image.jpg`} alt="Default Image" />
    ),
    action: (
      <Flex gap="small">
        <Button type="primary" onClick={() => handleEdit(car)}>
          Edit
        </Button>
        <Popconfirm
          title="Delete the car"
          description="Are you sure to delete this car?"
          onConfirm={() => deleteData(car.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      </Flex>
    ),
  }));


  return (
    <div>
      <section id="Cars">
        <h1>Cars</h1>
        <Table
          loading={loader}
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />

        <Modal
          title={isEditMode ? "Edit Car" : "Add Car"}
          open={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          okText="Submit"
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            layout="vertical"
            onFinish={handleFormSubmit}
          >
            <Form.Item
              label="Color"
              name="color"
              rules={[{ required: true, message: "Please input the car color!" }]}
            >
              <Input  value={postColor} onChange={(e) => setPostColor(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="Brand"
              name="brand_id"
              rules={[{ required: true, message: "Please select the brand!" }]}
            >
              <Select
                value={selectedBrand}
                onChange={(value) => setSelectedBrand(value)}
                options={brands.map(brand => ({ value: brand.id, label: brand.title }))}
              />
            </Form.Item>
            <Form.Item
              label="Model"
              name="model_id"
              rules={[{ required: true, message: "Please select the model!" }]}
            >
              <Select
                value={selectedModel}
                onChange={(value) => setSelectedModel(value)}
                options={models.map(model => ({ value: model.id, label: model.name }))}
              />
            </Form.Item>
            <Form.Item
              label="Category"
              name="category_id"
              rules={[{ required: true, message: "Please select the category!" }]}
            >
              <Select
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
                options={categories.map(category => ({ value: category.id, label: category.name_en }))}
              />
            </Form.Item>
            <Form.Item
              label="City"
              name="city_id"
              rules={[{ required: true, message: "Please select the city!" }]}
            >
              <Select
                value={selectedCity}
                onChange={(value) => setSelectedCity(value)}
                options={cities.map(city => ({ value: city.id, label: city.name }))}
              />
            </Form.Item>
            <Form.Item
              label="Location"
              name="location_id"
              rules={[{ required: true, message: "Please select the location!" }]}
            >
              <Select
                value={selectedLocation}
                onChange={(value) => setSelectedLocation(value)}
                options={locations.map(location => ({ value: location.id, label: location.name }))}
              />
            </Form.Item>
            <Form.Item
              label="Year"
              name="year"
              rules={[{ required: true, message: "Please input the year!" }]}
            >
              <Input type='number'min={1} />
            </Form.Item>
            <Form.Item
              label="Max Speed"
              name="max_speed"
              rules={[{ required: true, message: "Please input the max speed!" }]}
            >
              <Input type='number'  min={1}/>
            </Form.Item>
            <Form.Item
              label="Max People"
              name="max_people"
              rules={[{ required: true, message: "Please input the max people!" }]}
            >
              <Input type='number' min={1} />
            </Form.Item>
            <Form.Item
              label="Transmission"
              name="transmission"
              rules={[{ required: true, message: "Please input the transmission!" }]}
            >
              <Input  type='number' min={1}/>
            </Form.Item>
            <Form.Item
              label="Motor"
              name="motor"
              rules={[{ required: true, message: "Please input the motor!" }]}
            >
              <Input type='number' min={1} />
            </Form.Item>
            <Form.Item
              label="Drive Side"
              name="drive_side"
              rules={[{ required: true, message: "Please input the drive side!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Petrol"
              name="petrol"
              rules={[{ required: true, message: "Please input the petrol!" }]}
            >
              <Input  type='number' min={1}/>
            </Form.Item>
            <Form.Item
              label="Limit Per Day"
              name="limitperday"
              rules={[{ required: true, message: "Please input the limit per day!" }]}
            >
              <Input  type='number' min={1}/>
            </Form.Item>
            <Form.Item
              label="Second"
              name="seconds"
              rules={[{ required: true, message: "Please input the seconds!" }]}
            >
              <Input type='number' min={1} />
            </Form.Item>

            <Form.Item
              label="Deposit"
              name="deposit"
              rules={[{ required: true, message: "Please input the deposit!" }]}
            >
              <Input  type='number' min={1}/>
            </Form.Item>
            <Form.Item
              label="Premium Protection"
              name="premium_protection"
              rules={[{ required: true, message: "Please input the premium protection!" }]}
            >
              <Input  type='number' min={1}/>
            </Form.Item>
            <Form.Item
              label="Price in AED"
              name="price_in_aed"
              rules={[{ required: true, message: "Please input the price in AED!" }]}
            >
              <Input  type='number' min={1}/>
            </Form.Item>
            <Form.Item
              label="Price in USD"
              name="price_in_usd"
              rules={[{ required: true, message: "Please input the price in USD!" }]}
            >
              <Input type='number' min={1} />
            </Form.Item>
            <Form.Item
              label="Price in AED Sale"
              name="price_in_aed_sale"
              rules={[{ required: true, message: "Please input the price in AED sale!" }]}
            >
              <Input type='number' min={1} />
            </Form.Item>
            <Form.Item
              label="Price in USD Sale"
              name="price_in_usd_sale"
              rules={[{ required: true, message: "Please input the price in USD sale!" }]}
            >
              <Input  type='number' min={1}/>
            </Form.Item>
            <Form.Item
              label="Inclusive"
              name="inclusive"
              valuePropName="checked"
            >
              <Switch onChange={(checked) => form.setFieldsValue({ inclusive: checked ? 'true' : 'false' })} />
            </Form.Item>
            <Form.Item
              label="Cover Images"
              name="cover"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                // Fayllar ro'yxatini qaytarish
                return e.fileList;
              }}
            >
              <Upload
                accept="image/*"
                listType="picture-card"
                customRequest={({ file, onSuccess, onError }) => {
                  try {

                    onSuccess("ok");
                  } catch (error) {
                    onError(error);
                  }
                }}
                onChange={(e) => {
                  console.log("Uploaded file list:", e.fileList);
                  setPostImage3(e.file.originFileObj);
                }}
                showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
              >
                <button
                  style={{
                    border: 0,
                    background: "none",
                  }}
                  type="button"
                >
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Upload Images"
              name="images"
              valuePropName="fileList"
              getValueFromEvent={(e) => {

                return e.fileList.map((file) => file.originFileObj);
              }}
            >
              <Upload
                accept="image/*"
                listType="picture-card"
                customRequest={({ file, onSuccess, onError }) => {
                  try {

                    onSuccess("ok");
                  } catch (error) {
                    onError(error);
                  }
                }}
                onChange={(e) => {
                  console.log("Uploaded file list:", e.fileList);
                  setPostImage(e.file.originFileObj);
                }}
                showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
              >
                <button
                  style={{
                    border: 0,
                    background: "none",
                  }}
                  type="button"
                >
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </button>
              </Upload>
            </Form.Item>


            <Form.Item
              label="Upload Images"
              name="images2"
              valuePropName="fileList"
              getValueFromEvent={({ file }) => {
                return [file.originFileObj];
              }}
            >
              <Upload
                accept="image/*"
                listType="picture-card"
                customRequest={({ file, onSuccess, onError }) => {
                  try {

                    onSuccess("ok");
                  } catch (error) {
                    onError(error);
                  }
                }}
                onChange={(e) => setPostImage2(e.file.originFileObj)}
                showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
              >
                <button
                  style={{
                    border: 0,
                    background: "none",
                  }}
                  type="button"
                >
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </button>
              </Upload>
            </Form.Item>


            <Form.Item>
              <Button type="primary" htmlType="submit">
                {isEditMode ? "Update" : "Add"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </section>
    </div>
  );
};

export default Cars;
