import React, { useMemo } from 'react';
import { Col, Table } from 'react-bootstrap';
import { fetchRequest } from '../../../helpers/createRequest';
import './main.css';

const rateTxt = ['Жуда кам', 'Кам', "Ўртача", 'Юқори', 'Жуда юқори'];
const tdColors = ['yellow', 'red', 'lighblue', '#4169E1', 'green'];

const rates = ['LOWEST', 'LOW', 'NORMAL', 'HIGH', 'HIGHEST'];

const CalculationTable = ({ data }) => {
  let colorBgNitro = '';
  let colorBgPo = '';
  let colorBgKa = '';
  let colorBgHumus = '';

  const calculateNitro = () => {
    const nitro = data.nitro;
    let rate = '';
    let rateValue = '';

    if (nitro <= 20) {
      rate = rateTxt[0];
      colorBgNitro = tdColors[0];
      rateValue = rates[0];
    } else if (nitro > 20 && nitro <= 30) {
      rate = rateTxt[1];
      colorBgNitro = tdColors[1];
      rateValue = rates[1];
    } else if (nitro > 30 && nitro <= 50) {
      rate = rateTxt[2];
      colorBgNitro = tdColors[2];
      rateValue = rates[2];
    } else if (nitro > 50 && nitro <= 60) {
      rate = rateTxt[3];
      colorBgNitro = tdColors[3];
      rateValue = rates[3];
    } else if (nitro > 60) {
      rate = rateTxt[4];
      colorBgNitro = tdColors[4];
      rateValue = rates[4];
    }
    return { rate, rateValue };
  };

  const calculateProvidedPhos = () => {
    const activePo = data.activePo;
    let rate = '';
    let rateValue = '';

    if (activePo >= 0 && activePo <= 15) {
      rate = rateTxt[0];
      colorBgPo = tdColors[0];
      rateValue = rates[0];
    } else if (activePo >= 16 && activePo <= 30) {
      rate = rateTxt[1];
      colorBgPo = tdColors[1];
      rateValue = rates[1];
    } else if (activePo >= 31 && activePo <= 45) {
      rate = rateTxt[2];
      colorBgPo = tdColors[2];
      rateValue = rates[2];
    } else if (activePo >= 46 && activePo <= 60) {
      rate = rateTxt[3];
      colorBgPo = tdColors[3];
      rateValue = rates[3];
    } else if (activePo > 60) {
      rate = rateTxt[4];
      colorBgPo = tdColors[4];
      rateValue = rates[4];
    }
    return {
      rate,
      rateValue,
    };
  };

  const calculateChangingKa = () => {
    const changingKa = data.changingKa;
    let rate = '';
    let rateValue = '';

    if (changingKa >= 0 && changingKa <= 100) {
      rate = rateTxt[0];
      colorBgKa = tdColors[0];
      rateValue = rates[0];
    } else if (changingKa >= 101 && changingKa <= 200) {
      rate = rateTxt[1];
      colorBgKa = tdColors[1];
      rateValue = rates[1];
    } else if (changingKa >= 201 && changingKa <= 300) {
      rate = rateTxt[2];
      colorBgKa = tdColors[2];
      rateValue = rates[2];
    } else if (changingKa >= 301 && changingKa <= 400) {
      rate = rateTxt[3];
      colorBgKa = tdColors[3];
      rateValue = rates[3];
    } else if (changingKa > 400) {
      rate = rateTxt[4];
      colorBgKa = tdColors[4];
      rateValue = rates[4];
    }
    return { rate, rateValue };
  };

  const calculateHumus = () => {
    const humus = data.humus;
    let rate = '';
    let rateValue = '';

    if (humus >= 0 && humus <= 0.8) {
      rate = rateTxt[0];
      colorBgHumus = tdColors[0];
      rateValue = rates[0];
    } else if (humus >= 0.81 && humus <= 1.2) {
      rate = rateTxt[1];
      colorBgHumus = tdColors[1];
      rateValue = rates[1];
    } else if (humus >= 1.21 && humus <= 1.6) {
      rate = rateTxt[2];
      colorBgHumus = tdColors[2];
      rateValue = rates[2];
    } else if (humus >= 1.61 && humus <= 2) {
      rate = rateTxt[3];
      colorBgHumus = tdColors[3];
      rateValue = rates[3];
    } else if (humus > 2) {
      rate = rateTxt[4];
      colorBgHumus = tdColors[4];
      rateValue = rates[4];
    }

    return {
      rate,
      rateValue,
    };
  };

  const calculateHumusExpense = humusRate => {
    let humusExpense = 0;
    if (humusRate === rateTxt[0]) {
      humusExpense = 20;
    } else if (humusRate === rateTxt[1]) {
      humusExpense = 15;
    } else if (humusRate === rateTxt[2]) {
      humusExpense = 10;
    } else if (humusRate === rateTxt[3]) {
      humusExpense = 5;
    } else if (humusRate === rateTxt[4]) {
      humusExpense = 0;
    }
    return humusExpense;
  };

  const fetchResult = () => {
    fetchRequest
      .post('samples', {
        given_nitrogen: parseFloat(data.nitro),
        given_phosphorus: parseFloat(data.activePo),
        given_potassium: parseFloat(data.changingKa),
        given_humus: parseFloat(data.humus),
        provided_level_nitrogen: nitroRate.rateValue,
        provided_level_phosphorus: activePoRate.rateValue,
        provided_level_potassium: changingKaRate.rateValue,
        provided_level_humus: humusRate.rateValue,
        coefficient_nitrogen: parseFloat(nitroValByCity),
        coefficient_phosphorus: parseFloat(phosphorCoiffecient),
        coefficient_potassium: parseFloat(kaCoiffecient),
        usage_per_centner_nitrogen: parseFloat(nitroAverage),
        usage_per_centner_phosphorus: parseFloat(phosphorAverage),
        usage_per_centner_potassium: parseFloat(kaAverage),
        usage_per_centner_humus: parseFloat(humusExpense),
        area: parseFloat(data.area),
        outline_number: data.outline_number,
        sample_number: data.sample_number,
        calculation_region: ~~data.city,
        calculation_district: ~~data.district,
        crop_type: ~~data.crop,
      })
      .then(res => {
        // console.log(res);
      })
      .catch(e => {
        // console.log(e);
      });
  };

  const nitroRate = calculateNitro();
  const activePoRate = calculateProvidedPhos();
  const changingKaRate = calculateChangingKa();
  const humusRate = calculateHumus();

  const nitroValByCity = data.nitroCo;

  const phosphorCoiffecient = data.activePoCo;
  const kaCoiffecient = data.changingKaCo;

  const cropValue = data.expenses;

  const humusExpense = calculateHumusExpense(humusRate.rate);

  const calculateAverageExpense = () => {
    let nitroAverage = 0;
    let phosphorAverage = 0;
    let kaAverage = 0;

    if (cropValue !== undefined) {
      nitroAverage = Number(nitroValByCity * cropValue.nitrogen_val).toFixed(4);
      phosphorAverage = Number(phosphorCoiffecient * nitroAverage * cropValue.phosphorus_val).toFixed(4);
      kaAverage = Number(kaCoiffecient * nitroAverage * cropValue.potassium_val).toFixed(4);
    }

    return {
      nitroAverage,
      phosphorAverage,
      kaAverage,
    };
  };

  const averageValues = calculateAverageExpense();

  const { nitroAverage, phosphorAverage, kaAverage } = averageValues;

  const calculateTotal = () => {
    let nitroTotal = 0;
    let phosphorTotal = 0;
    let kaTotal = 0;
    let humusTotal = 0;

    if (data.area !== undefined) {
      nitroTotal = Number(averageValues.nitroAverage * data.area).toFixed(4);
      phosphorTotal = Number(averageValues.phosphorAverage * data.area).toFixed(4);
      kaTotal = Number(averageValues.kaAverage * data.area).toFixed(4);
      humusTotal = Number(humusExpense * data.area).toFixed(2);
    }
    if (data.city) {
      fetchResult();
    }

    return {
      nitroTotal,
      phosphorTotal,
      kaTotal,
      humusTotal,
    };
  };

  const totalValues = useMemo(() => calculateTotal(), [data]);

  return (
    <Col md="8" className="">
      <div className="table-flow">
        <Table className="table-result">
          <thead>
            <tr>
              <th></th>
              <th>NO3 (мг/кг ҳисобида)</th>
              <th>Ҳаракатчан P2O5 (мг/кг ҳисобида)</th>
              <th>Almashinuvchan K20 (мг/кг ҳисобида)</th>
              <th>Гумус % ҳисобида</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Киритилган қиймат</th>
              <td>{data.nitro}</td>
              <td>{data.activePo}</td>
              <td>{data.changingKa}</td>
              <td>{data.humus}</td>
            </tr>
            <tr>
              <th>Таъминланганлик даражаси</th>
              <td className="rate" bgcolor={colorBgNitro}>
                {nitroRate.rate}
              </td>
              <td className="rate" bgcolor={colorBgPo}>
                {activePoRate.rate}
              </td>
              <td className="rate" bgcolor={colorBgKa}>
                {changingKaRate.rate}
              </td>
              <td className="rate" bgcolor={colorBgHumus}>
                {humusRate.rate}
              </td>
            </tr>

            <tr>
              <th>Коеффициент</th>
              <td>{nitroValByCity}</td>
              <td>{phosphorCoiffecient}</td>
              <td>{kaCoiffecient}</td>
              <td></td>
            </tr>

            <tr>
              <th>1 сентнерга ўртача сарфи (кг)</th>
              <td>{averageValues.nitroAverage}</td>
              <td>{averageValues.phosphorAverage}</td>
              <td>{averageValues.kaAverage}</td>
              <td>{humusExpense} t/ga</td>
            </tr>

            <tr>
              <th>Жами майдонга сентнер учун талаб етилади (кг)</th>
              <td>{totalValues.nitroTotal}</td>
              <td>{totalValues.phosphorTotal}</td>
              <td>{totalValues.kaTotal}</td>
              <td>{totalValues.humusTotal} t</td>
            </tr>
          </tbody>
        </Table>
        <Table className="table-result">
          <thead>
            <tr>
              <th></th>
              <th className="rate" bgcolor={tdColors[0]}>
                Жуда кам
              </th>
              <th className="rate" bgcolor={tdColors[1]}>
                Кам
              </th>
              <th className="rate" bgcolor={tdColors[2]}>
                Ўртача
              </th>
              <th className="rate" bgcolor={tdColors[3]}>
                Юқори
              </th>
              <th className="rate" bgcolor={tdColors[4]}>
                Жуда юқори
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Фосфор миқдори, мг/кг</th>
              <td className="no-wrap">0-15</td>
              <td className="no-wrap">16-30</td>
              <td className="no-wrap">31-45</td>
              <td className="no-wrap">46-60</td>
              <td className="no-wrap">60+</td>
            </tr>
            <tr>
              <th>Калий миқдори, мг/кг</th>
              <td className="no-wrap">0-100</td>
              <td className="no-wrap">101-200</td>
              <td className="no-wrap">201-300</td>
              <td className="no-wrap">301-400</td>
              <td className="no-wrap">400+</td>
            </tr>
            <tr>
              <th>Гумус миқдори, % ҳисобида</th>
              <td className="no-wrap">0-0.80 </td>
              <td className="no-wrap">0.81-1.20</td>
              <td className="no-wrap">1.21-1.60</td>
              <td className="no-wrap">1.61-2.00</td>
              <td className="no-wrap">2.00+</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Col>
  );
};

export default CalculationTable;
