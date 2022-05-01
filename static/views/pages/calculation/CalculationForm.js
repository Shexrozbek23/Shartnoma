import { Col, Form, Button } from 'react-bootstrap';
import React, { useState, useContext } from 'react';
import AuthContext from '../../../store/auth-context';

const CalculationForm = props => {
  const ctx = useContext(AuthContext);

  const [outlineNumber, setOutlineNumber] = useState('');
  const [sampleNumber, setSampleNumber] = useState('');
  const [enteredArea, setEnteredArea] = useState('');
  const [enteredPh, setEnteredPh] = useState('');
  const [enteredNitro, setEnteredNitro] = useState('');
  const [enteredActivePo, setEnteredActivePo] = useState('');
  const [enteredKa, setEnteredKa] = useState('');
  const [enteredHumus, setEnteredHumus] = useState('');

  const [enteredCity, setEnteredCity] = useState('');
  const [district, setDistrict] = useState('');
  const [districts, setDistrics] = useState([]);
  const [enteredCrop, setEnteredCrop] = useState('');

  const handleCityChange = e => {
    setEnteredCity(e.target.value);
    const districtsData = ctx.districts.filter(dis => dis.region == e.target.value);
    // console.log(districtsData);
    setDistrics(districtsData);
  };

  const handleDistrictChange = e => {
    setDistrict(e.target.value);
  };

  const handleAreaChange = e => {
    setEnteredArea(e.target.value);
  };

  const handlePhChange = e => {
    setEnteredPh(e.target.value);
  };

  const handleNitroChange = e => {
    setEnteredNitro(e.target.value);
  };

  const handleActivePoChange = e => {
    setEnteredActivePo(e.target.value);
  };

  const handleKaChange = e => {
    setEnteredKa(e.target.value);
  };

  const handleHumusChange = e => {
    setEnteredHumus(e.target.value);
  };

  const handleCropChange = e => {
    setEnteredCrop(e.target.value);
  };

  const submitHandler = event => {
    event.preventDefault();

    const data = {
      city: enteredCity,
      district: district,
      outline_number: outlineNumber,
      sample_number: sampleNumber,
      area: enteredArea,
      crop: enteredCrop,
      phData: enteredPh,
      nitro: enteredNitro,
      activePo: Number(enteredActivePo).toFixed(1),
      changingKa: Number(enteredKa).toFixed(0),
      humus: enteredHumus,
    };

    props.onSubmitAction(data);
  };

  return (
    <Col md="3" className="">
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label>Вилоят</Form.Label>
          <Form.Select className="form-control" value={enteredCity} onChange={handleCityChange} required>
            <option value="" disabled>
              Вилоят...
            </option>
            {ctx.regions.map((reg, idx) => {
              return (
                <option key={idx} value={reg.id}>
                  {reg.name_uz}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Туман</Form.Label>
          <Form.Select className="form-control" value={district} onChange={handleDistrictChange} required>
            <option value="" disabled>
              Туман...
            </option>
            {enteredCity
              ? districts.map((dis, idx) => {
                  return (
                    <option key={idx} value={dis.id}>
                      {dis.name_local}
                    </option>
                  );
                })
              : ''}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <label>Намуна идентификацион рақами</label>
          <Form.Control
            required
            value={sampleNumber}
            onChange={e => {
              setSampleNumber(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group>
          <label>Контур рақами</label>
          <Form.Control
            type="number"
            required
            value={outlineNumber}
            onChange={e => {
              setOutlineNumber(e.target.value);
            }}
            step="1"
            min="0"
          />
        </Form.Group>

        <Form.Group>
          <label>Майдон (га)</label>
          <Form.Control type="number" value={enteredArea} onChange={handleAreaChange} step="0.01" min="0" />
        </Form.Group>

        <Form.Group>
          <label>Экин тури</label>
          <Form.Select className="form-control" value={enteredCrop} onChange={handleCropChange} required>
            <option value="" disabled>
              Экин тури...
            </option>
            {ctx.crops.map((exp, idx) => {
              return (
                <option key={idx} value={exp.id}>
                  {exp.name_uz}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <label>PH нейтрал (pH=7)</label>
          <Form.Control type="number" value={enteredPh} onChange={handlePhChange} step="0.01" min="0" />
        </Form.Group>
        <Form.Group>
          <label>NO3 (мг/кг ҳисобида)</label>
          <Form.Control type="number" value={enteredNitro} onChange={handleNitroChange} step="0.01" min="0" required />
        </Form.Group>
        <Form.Group>
          <label>Ҳаракатчан P2O5 (мг/кг ҳисобида)</label>
          <Form.Control
            type="number"
            value={enteredActivePo}
            onChange={handleActivePoChange}
            step="0.01"
            min="0"
            required
          />
        </Form.Group>
        <Form.Group>
          <label>Алмашинувчан K20 (мг/кг ҳисобида)</label>
          <Form.Control type="number" value={enteredKa} onChange={handleKaChange} min="0" required />
        </Form.Group>
        <Form.Group>
          <label>Гумус % ҳисобида</label>
          <Form.Control type="number" value={enteredHumus} onChange={handleHumusChange} step="0.01" min="0" required />
        </Form.Group>
        {/* {!isValid && <p>Viloyat yoki ekin turini tanlang</p>} */}
        <Button className="mt-3" variant="primary" type="submit">
          Ҳисоблаш
        </Button>
      </Form>
    </Col>
  );
};

export default CalculationForm;
