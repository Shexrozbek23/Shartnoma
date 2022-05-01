import React, { useState, useEffect, useContext } from 'react';
import { Col, Table } from 'react-bootstrap';
import { fetchRequest } from '../../../helpers/createRequest';
import { Loader } from '../../../vibe';
import AuthContext from '../../../store/auth-context';
import './results.css';

const rateTxt = ['Жуда кам', 'Кам', 'Ўртача', 'Юқори', 'Жуда юқори'];
const tdColors = ['yellow', 'red', 'lighblue', '#4169E1', 'green'];

const Sample = ({ match }) => {
  const sampleId = match.params.sampleId;

  const ctx = useContext(AuthContext);

  const [sample, setSample] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    const sampleData = await getSample(sampleId);
    setSample(sampleData);
    setIsLoading(false);
  }, []);

  const getSample = async sampleId => {
    setIsLoading(true);
    const sample = await fetchRequest.get(`samples/${sampleId}`).then(res => res.data);
    return sample;
  };

  const limitFloat = (val, limit = 1) => {
    return Number(val).toFixed(limit);
  };

  const calculateProvidedValues = val => {
    let rate = '';
    let valColor = '';
    switch (val) {
      case 'LOWEST':
        rate = rateTxt[0];
        valColor = tdColors[0];
        break;
      case 'LOW':
        rate = rateTxt[1];
        valColor = tdColors[1];
        break;
      case 'NORMAL':
        rate = rateTxt[2];
        valColor = tdColors[2];
        break;
      case 'HIGH':
        rate = rateTxt[3];
        valColor = tdColors[3];
        break;
      case 'HIGHEST':
        rate = rateTxt[4];
        valColor = tdColors[4];
        break;
      default:
        break;
    }
    return {
      rate,
      valColor,
    };
  };

  const findDistrict = dis => {
    const district = ctx.districts.find(dist => dist.id == dis);
    return district ? district.name_local : '';
  };

  const nitroRate = calculateProvidedValues(sample.provided_level_nitrogen);
  const activePoRate = calculateProvidedValues(sample.provided_level_phosphorus);
  const changingKaRate = calculateProvidedValues(sample.provided_level_potassium);
  const humusRate = calculateProvidedValues(sample.provided_level_humus);

  return (
    <Col md="12" className="">
      <div className="table-flow">
        {!isLoading ? (
          <>
            <h4>Вилоят: {sample.name_calculation_region}</h4>
            <h4>Туман: {findDistrict(sample.calculation_district)}</h4>
            <h4>Контур рақами: {sample.outline_number}</h4>
            <h4>Майдон (га): {sample.area}</h4>
            <h4>Экин тури: {sample.name_crop_type}</h4>
            <Table className="table-result">
              <thead>
                <tr>
                  <th></th>
                  <th>NO3 (мг/кг ҳисобида)</th>
                  <th>Ҳаракатчан P2O5 (мг/кг ҳисобида)</th>
                  <th>Алмашинувчан K20 (мг/кг ҳисобида)</th>
                  <th>Гумус % hisobida</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Киритилган қиймат</th>
                  <td>{limitFloat(sample.given_nitrogen)}</td>
                  <td>{limitFloat(sample.given_phosphorus)}</td>
                  <td>{limitFloat(sample.given_potassium)}</td>
                  <td>{limitFloat(sample.given_humus)}</td>
                </tr>
                <tr>
                  <th>Таъминланганлик даражаси</th>
                  <td className="rate" bgcolor={nitroRate.valColor}>
                    {nitroRate.rate}
                  </td>
                  <td className="rate" bgcolor={activePoRate.valColor}>
                    {activePoRate.rate}
                  </td>
                  <td className="rate" bgcolor={changingKaRate.valColor}>
                    {changingKaRate.rate}
                  </td>
                  <td className="rate" bgcolor={humusRate.valColor}>
                    {humusRate.rate}
                  </td>
                </tr>

                <tr>
                  <th>Коеффициент</th>
                  <td>{sample.coefficient_nitrogen}</td>
                  <td>{sample.coefficient_phosphorus}</td>
                  <td>{sample.coefficient_potassium}</td>
                  <td></td>
                </tr>

                <tr>
                  <th>1 сентнерга ўртача сарфи (кг)</th>
                  <td>{limitFloat(sample.usage_per_centner_nitrogen, 4)}</td>
                  <td>{limitFloat(sample.usage_per_centner_phosphorus, 4)}</td>
                  <td>{limitFloat(sample.usage_per_centner_potassium, 4)}</td>
                  <td>{limitFloat(sample.usage_per_centner_humus, 4)} t/ga</td>
                </tr>

                <tr>
                  <th>Жами майдонга сентнер учун талаб этилади (кг)</th>
                  <td>{limitFloat(sample.usage_per_centner_nitrogen * sample.area, 4)}</td>
                  <td>{limitFloat(sample.usage_per_centner_phosphorus * sample.area, 4)}</td>
                  <td>{limitFloat(sample.usage_per_centner_potassium * sample.area, 4)}</td>
                  <td>{limitFloat(sample.usage_per_centner_humus * sample.area, 4)} t</td>
                </tr>
              </tbody>
            </Table>
          </>
        ) : (
          <Loader type="spin" />
        )}
      </div>
    </Col>
  );
};

export default Sample;
