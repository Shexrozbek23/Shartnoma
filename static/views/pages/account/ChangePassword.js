import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Input, Button } from 'reactstrap';
import { fetchRequest } from '../../../helpers/createRequest';

const inputFields = [
  {
    id: 1,
    name: 'old_password',
    type: 'password',
    placeholder: 'Жорий парол',
  },
  {
    id: 2,
    name: 'new_password',
    type: 'password',
    placeholder: 'Янги парол',
  },
  {
    id: 3,
    name: 'verified_password',
    type: 'password',
    placeholder: 'Янги паролни қайта киритинг',
  },
];

const initialValues = {
  old_password: '',
  new_password: '',
  verified_password: '',
};

const ChangePassword = props => {
  const [error, setError] = useState(false);
  const [password, setPassword] = useState(true);
  const [successRes, setSuccess] = useState(false);
  const [isMatching, setIsMatching] = useState(true);
  const [formValues, setFormValues] = useState(initialValues);

  const changePassRequest = async () => {
    fetchRequest
      .post('user/', {
        old_password: formValues.old_password,
        new_password: formValues.new_password,
      })
      .then(res => {
        // console.log(res);
        if (res.data.username) {
          setSuccess(true);
          setError(false);
          setPassword(true);
        } else if (res.data.old_password) {
          setSuccess(false);
          setPassword(false);
          setError(false);
        } else if (res.data.new_password) {
          setSuccess(false);
          setError(true);
          setPassword(true);
        }
      })
      .catch(e => {
        // console.log(e);
        setError(true);
      });
  };

  const changeFormValues = e => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = event => {
    event.preventDefault();
    // console.log(formValues);
    if (formValues.new_password == formValues.verified_password) {
      setIsMatching(true);
      changePassRequest();
    } else {
      setIsMatching(false);
    }
  };

  return (
    <Col md="12" xs="12">
      <h3 className="text-center">Паролни ўзгартириш</h3>
      <Row>
        <Col md="6" className="ml-auto mr-auto">
          <Form onSubmit={submitHandler}>
            {error ? (
              <p style={{ color: '#f86c6b' }}>Хатолик! (Еслатма: Парол 8 белги ва бир ҳарфдан иборат бўлиши керак)</p>
            ) : (
              ''
            )}
            {successRes ? <p style={{ color: '#4dbd74' }}>Муваффақиятли ўзгартирилди!</p> : ''}
            {inputFields.map(({ name, type, placeholder }, key) => (
              <FormGroup key={key}>
                <Input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  onChange={e => {
                    changeFormValues(e);
                  }}
                  required
                />
              </FormGroup>
            ))}
            {!isMatching && <p style={{ color: '#f86c6b' }}>Янги парол ва тасдиқлаш ўзаро мос келмади!</p>}
            {!password && <p style={{ color: '#f86c6b' }}>Жорий парол нотўғри!</p>}
            <Button type="submit" size="sm" color="primary">
              Сақлаш
            </Button>
          </Form>
        </Col>
      </Row>
    </Col>
  );
};

export default ChangePassword;
