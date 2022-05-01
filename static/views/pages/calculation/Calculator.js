import React, { useState } from 'react';
import { Row } from 'react-bootstrap';
import createRequest from '../../../helpers/createRequest';

import CalculationForm from './CalculationForm';
import CalculationTable from './CalculationTable';

const Calculator = () => {
  const [dataObj, setDataObj] = useState({});

  const getRegionValues = async cityId => {
    const regs = await createRequest.get('regions/').then(res => res.data);

    const regCo = regs.filter(reg => reg.id == cityId);
    // console.log(regCo);
    return regCo;
  };

  const getExpenseValue = async cropId => {
    const expenses = await createRequest.get(`expenses/${cropId}/`).then(res => res.data);
    return expenses;
  };

  const getActivePoValue = async activePo => {
    const activePoVal = await createRequest.get(`phosphorus/${activePo}`).then(res => res.data);
    return activePoVal;
  };

  const getKaValue = async changingKa => {
    const kaVal = await createRequest.get(`potassium/${changingKa}`).then(res => res.data);
    return kaVal;
  };

  const checkActivePoVal = po => {
    if (po < 7.5) {
      return '7.5';
    } else if (po > 60) {
      return '60.0';
    } else {
      return po;
    }
  };

  const checkKaVal = ka => {
    if (ka < 50) {
      return '50';
    } else if (ka > 400) {
      return '400';
    } else {
      return ka;
    }
  };

  const calculateAnalysis = async data => {
    const activePhos = checkActivePoVal(data.activePo);
    const regValue = await getRegionValues(data.city);
    const expensesValues = await getExpenseValue(data.crop);
    // const activePo = await getActivePoValue(data.activePo);
    const activePo = await getActivePoValue(activePhos);
    // const kaVal = await getKaValue(Number(data.changingKa).toFixed(1));
    const kaVal = await getKaValue(Number(checkKaVal(data.changingKa)).toFixed(1));
    setDataObj({
      city: data.city,
      district: data.district,
      outline_number: data.outline_number,
      area: data.area,
      crop: data.crop,
      sample_number: data.sample_number,
      phData: data.phData,
      nitro: data.nitro,
      activePo: data.activePo,
      changingKa: data.changingKa,
      humus: data.humus,
      nitroCo: regValue[0].coefficient,
      expenses: expensesValues,
      activePoCo: activePo.val,
      changingKaCo: kaVal.val,
    });
    // console.log(regValue[0].coefficient, activePo.val, kaVal.val, expensesValues);

    // console.log(regValue.coefficient, activePo.val, kaVal.val);
  };

  return (
    <Row className="align-items-between">
      <CalculationForm onSubmitAction={calculateAnalysis} />
      <CalculationTable data={dataObj} />
    </Row>
  );
};

export default Calculator;
