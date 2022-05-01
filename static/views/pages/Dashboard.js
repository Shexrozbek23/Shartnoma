import React, { useContext, useEffect, useState, useRef } from 'react';
import { Card, CardBody, Row, Col, Table, CardHeader, Button } from 'reactstrap';
import Preloader from '../../components/Preloader';
import queryString from 'query-string';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import _ from 'lodash';
import { fetchRequest } from '../../helpers/createRequest';
import AuthContext from '../../store/auth-context';

const Dashboard = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [res, setRes] = useState({});
  const ctx = useContext(AuthContext);
  const tdColors = ['yellow', 'red', '#00B0E0', '#4169E1', 'green'];
  const queryParams = queryString.parse(window.location.search);
  const percentage = (type, per) => {
    if (!_.isEmpty(res)) {
      if (typeof _.get(res, [type, 'requested_all'], 0) !== 'number') {
        return 0;
      }
      return parseFloat(((_.get(res, [type, per], 0) || 0) / _.get(res, [type, 'requested_all'], 0)) * 100).toFixed(2);
    } else return 0;
  };
  const onFilter = (itemValue, itemKey) => {
    const rootParams = { ...queryParams };
    if (itemValue) {
      rootParams[itemKey] = itemValue;
      rootParams.page = null;
    } else {
      rootParams[itemKey] = null;
    }
    props.history.push({ search: queryString.stringify(rootParams, { skipNull: true }) });
  };
  const getAverage = type => {
    if (!_.isEmpty(res)) {
      if (type == 'phosphorus') {
        return parseFloat(
          (percentage('phosphorus', 'lowest_requested_all') * 7.5 +
            percentage('phosphorus', 'low_requested_all') * 23 +
            percentage('phosphorus', 'normal_requested_all') * 38 +
            percentage('phosphorus', 'high_requested_all') * 53 +
            percentage('phosphorus', 'highest_requested_all') * 68) /
            100
        ).toFixed(2);
      }
      if (type == 'humus') {
        return parseFloat(
          (percentage('humus', 'lowest_requested_all') * 0.4 +
            percentage('humus', 'low_requested_all') * 1.005 +
            percentage('humus', 'normal_requested_all') * 1.405 +
            percentage('humus', 'high_requested_all') * 1.805 +
            percentage('humus', 'highest_requested_all') * 2.195) /
            100
        ).toFixed(2);
      }
      if (type == 'potassium') {
        return parseFloat(
          (percentage('potassium', 'lowest_requested_all') * 50 +
            percentage('potassium', 'low_requested_all') * 150.5 +
            percentage('potassium', 'normal_requested_all') * 250.5 +
            percentage('potassium', 'high_requested_all') * 350.5 +
            percentage('potassium', 'highest_requested_all') * 450.5) /
            100
        ).toFixed(2);
      } else return 0;
    }
  };
  useEffect(async () => {
    const getStatisticsSamples = async () => {
      setIsLoading(true);
      const phosphorus = await fetchRequest
        .get('statistics/samples', {
          params: {
            type: 'phosphorus',
            calculation_region: queryParams.calculation_region,
            calculation_district: queryParams.calculation_district,
          },
        })
        .then(res => res.data);
      const potassium = await fetchRequest
        .get('statistics/samples', {
          params: {
            type: 'potassium',
            calculation_region: queryParams.calculation_region,
            calculation_district: queryParams.calculation_district,
          },
        })
        .then(res => res.data);
      const humus = await fetchRequest
        .get('statistics/samples', {
          params: {
            type: 'humus',
            calculation_region: queryParams.calculation_region,
            calculation_district: queryParams.calculation_district,
          },
        })
        .then(res => res.data);
      setIsLoading(false);
      return { phosphorus, potassium, humus };
    };
    if (ctx.isLoggedIn) {
      const samplesData = await getStatisticsSamples();
      setRes(samplesData);
    }
  }, [queryParams.calculation_region, queryParams.calculation_district]);

  return (
    <Preloader loading={isLoading}>
      {ctx.role == 0 && (
        <Row>
          <Col lg="4" md="12" className="mb-2">
            <select
              value={queryParams.calculation_region || ''}
              className="form-control"
              id="calculation_region"
              onChange={e => onFilter(e.target.value, 'calculation_region')}
            >
              <option value={''}>Вилоят</option>
              {ctx.regions &&
                ctx.regions.map((reg, idx) => {
                  return (
                    <option key={idx} value={reg.id}>
                      {reg.name_uz}
                    </option>
                  );
                })}
            </select>
          </Col>
          <Col lg="4" md="12" className="mb-2">
            <select
              value={queryParams.calculation_district || ''}
              className="form-control"
              id="calculation_region"
              onChange={e => onFilter(e.target.value, 'calculation_district')}
            >
              <option value={''}>Туман</option>
              {queryParams.calculation_region
                ? ctx.districts
                    .filter(dis => dis.region == queryParams.calculation_region)
                    .map((dis, idx) => {
                      return (
                        <option key={idx} value={dis.id}>
                          {dis.name_local}
                        </option>
                      );
                    })
                : ''}
            </select>
          </Col>
        </Row>
      )}

      <Row>
        <Col lg="4" md="12" className="mb-2">
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn btn-primary"
            table="table-to-xls"
            filename="Умумий статистика"
            sheet="tablexls"
            buttonText="Файл юклаб олиш (.xls)"
          />
        </Col>
        {/* <Col md={12}>
          <Card>
            <CardHeader className={'text-center text-bold'}>
              Тупроқларининг харакатчан фосфор билан таъминланиш <br />
              <b>ДАРАЖАЛАРИ</b>
            </CardHeader>
            <CardBody>
              <Table responsive={true}>
                <thead>
                  <tr>
                    <th rowSpan={3}>№</th>
                    <th rowSpan={3}>Текширилган майдон, га</th>
                    <th colSpan={10}>ФОСФОР миқдори, мг/кг</th>
                    <th rowSpan={3}>Ўртача қиймат, мг/кг</th>
                  </tr>
                  <tr>
                    <th bgcolor={tdColors[0]} colSpan={2}>
                      Жуда кам
                      <br />
                      0-15
                    </th>
                    <th bgcolor={tdColors[1]} colSpan={2}>
                      Кам
                      <br />
                      16-30
                    </th>
                    <th bgcolor={tdColors[2]} colSpan={2}>
                      Ўртача
                      <br />
                      31-45
                    </th>
                    <th bgcolor={tdColors[3]} colSpan={2}>
                      Юқори
                      <br />
                      46-60
                    </th>
                    <th bgcolor={tdColors[4]} colSpan={2}>
                      Жуда юқори
                      <br />
                      60&lt;
                    </th>
                  </tr>
                  <tr>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Жами</td>
                    <td>{_.get(res, ['phosphorus', 'requested_all'], 0) || 0}</td>
                    <td>{_.get(res, ['phosphorus', 'lowest_requested_all'], 0) || 0}</td>
                    <td>{percentage('phosphorus', 'lowest_requested_all')}</td>
                    <td>{_.get(res, ['phosphorus', 'low_requested_all'], 0) || 0}</td>
                    <td>{percentage('phosphorus', 'low_requested_all')}</td>
                    <td>{_.get(res, ['phosphorus', 'normal_requested_all'], 0) || 0}</td>
                    <td>{percentage('phosphorus', 'normal_requested_all')}</td>
                    <td>{_.get(res, ['phosphorus', 'high_requested_all'], 0) || 0}</td>
                    <td>{percentage('phosphorus', 'high_requested_all')}</td>
                    <td>{_.get(res, ['phosphorus', 'highest_requested_all'], 0) || 0}</td>
                    <td>{percentage('phosphorus', 'highest_requested_all')}</td>
                    <td>{getAverage('phosphorus')}</td>
                  </tr>
                </tbody>
              </Table>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className={'text-center text-bold'}>
              Тупроқларининг алмашувчан калий билан таъминланиш <br />
              <b>ДАРАЖАЛАРИ</b>
            </CardHeader>
            <CardBody>
              <Table responsive={true}>
                <thead>
                  <tr>
                    <th rowSpan={3}>№</th>
                    <th rowSpan={3}>Текширилган майдон, га</th>
                    <th colSpan={10}>КАЛИЙ миқдори, мг/кг</th>
                    <th rowSpan={3}>Ўртача қиймат, мг/кг</th>
                  </tr>
                  <tr>
                    <th bgcolor={tdColors[0]} colSpan={2}>
                      Жуда кам
                      <br />
                      0-100
                    </th>
                    <th bgcolor={tdColors[1]} colSpan={2}>
                      Кам
                      <br />
                      101-200
                    </th>
                    <th bgcolor={tdColors[2]} colSpan={2}>
                      Ўртача
                      <br />
                      201-300
                    </th>
                    <th bgcolor={tdColors[3]} colSpan={2}>
                      Юқори
                      <br />
                      301-400
                    </th>
                    <th bgcolor={tdColors[4]} colSpan={2}>
                      Жуда юқори
                      <br />
                      400&lt;
                    </th>
                  </tr>
                  <tr>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Жами</td>
                    <td>{_.get(res, ['potassium', 'requested_all'], 0) || 0}</td>
                    <td>{_.get(res, ['potassium', 'lowest_requested_all'], 0) || 0}</td>
                    <td>{percentage('potassium', 'lowest_requested_all')}</td>
                    <td>{_.get(res, ['potassium', 'low_requested_all'], 0) || 0}</td>
                    <td>{percentage('potassium', 'low_requested_all')}</td>
                    <td>{_.get(res, ['potassium', 'normal_requested_all'], 0) || 0}</td>
                    <td>{percentage('potassium', 'normal_requested_all')}</td>
                    <td>{_.get(res, ['potassium', 'high_requested_all'], 0) || 0}</td>
                    <td>{percentage('potassium', 'high_requested_all')}</td>
                    <td>{_.get(res, ['potassium', 'highest_requested_all'], 0) || 0}</td>
                    <td>{percentage('potassium', 'highest_requested_all')}</td>
                    <td>{getAverage('potassium')}</td>
                  </tr>
                </tbody>
              </Table>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className={'text-center text-bold'}>
              Тупроқларининг гумус билан таъминланиш <br />
              <b>ДАРАЖАЛАРИ</b>
            </CardHeader>
            <CardBody>
              <Table responsive={true}>
                <thead>
                  <tr>
                    <th rowSpan={3}>№</th>
                    <th rowSpan={3}>Текширилган майдон, га</th>
                    <th colSpan={10}>ГУМУС миқдори, фоиз ҳисобида</th>
                    <th rowSpan={3}>Ўртача қиймат, %</th>
                  </tr>
                  <tr>
                    <th bgcolor={tdColors[0]} colSpan={2}>
                      Жуда кам
                      <br />
                      0-0,80
                    </th>
                    <th bgcolor={tdColors[1]} colSpan={2}>
                      Кам
                      <br />
                      0,81-1,20
                    </th>
                    <th bgcolor={tdColors[2]} colSpan={2}>
                      Ўртача
                      <br />
                      1,21-1,60
                    </th>
                    <th bgcolor={tdColors[3]} colSpan={2}>
                      Юқори
                      <br />
                      1,61-2,00
                    </th>
                    <th bgcolor={tdColors[4]} colSpan={2}>
                      Жуда юқори
                      <br />
                      2,00&lt;
                    </th>
                  </tr>
                  <tr>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Жами</td>
                    <td>{_.get(res, ['humus', 'requested_all'], 0) || 0}</td>
                    <td>{_.get(res, ['humus', 'lowest_requested_all'], 0) || 0}</td>
                    <td>{percentage('humus', 'lowest_requested_all')}</td>
                    <td>{_.get(res, ['humus', 'low_requested_all'], 0) || 0}</td>
                    <td>{percentage('humus', 'low_requested_all')}</td>
                    <td>{_.get(res, ['humus', 'normal_requested_all'], 0) || 0}</td>
                    <td>{percentage('humus', 'normal_requested_all')}</td>
                    <td>{_.get(res, ['humus', 'high_requested_all'], 0) || 0}</td>
                    <td>{percentage('humus', 'high_requested_all')}</td>
                    <td>{_.get(res, ['humus', 'highest_requested_all'], 0) || 0}</td>
                    <td>{percentage('humus', 'highest_requested_all')}</td>
                    <td>{getAverage('humus')}</td>
                  </tr>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col> */}

        <Col md={12}>
          <Card>
            {/* <CardHeader className={'text-center text-bold'}></CardHeader> */}
            <CardBody>
              <Table responsive={true} id="table-to-xls">
                <thead>
                  <tr>
                    <th colSpan={13}>
                      Тупроқларининг харакатчан фосфор билан таъминланиш <br />
                      <b>ДАРАЖАЛАРИ</b>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={3}>№</th>
                    <th rowSpan={3}>Текширилган майдон, га</th>
                    <th colSpan={10}>ФОСФОР миқдори, мг/кг</th>
                    <th rowSpan={3}>Ўртача қиймат, мг/кг</th>
                  </tr>
                  <tr>
                    <th bgcolor={tdColors[0]} colSpan={2}>
                      Жуда кам
                      <br />
                      0-15
                    </th>
                    <th bgcolor={tdColors[1]} colSpan={2}>
                      Кам
                      <br />
                      16-30
                    </th>
                    <th bgcolor={tdColors[2]} colSpan={2}>
                      Ўртача
                      <br />
                      31-45
                    </th>
                    <th bgcolor={tdColors[3]} colSpan={2}>
                      Юқори
                      <br />
                      46-60
                    </th>
                    <th bgcolor={tdColors[4]} colSpan={2}>
                      Жуда юқори
                      <br />
                      60&lt;
                    </th>
                  </tr>
                  <tr>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Жами</td>
                    <td>{_.get(res, ['phosphorus', 'requested_all'], 0) || 0}</td>
                    <td>{_.get(res, ['phosphorus', 'lowest_requested_all'], 0) || 0}</td>
                    <td>{percentage('phosphorus', 'lowest_requested_all')}</td>
                    <td>{_.get(res, ['phosphorus', 'low_requested_all'], 0) || 0}</td>
                    <td>{percentage('phosphorus', 'low_requested_all')}</td>
                    <td>{_.get(res, ['phosphorus', 'normal_requested_all'], 0) || 0}</td>
                    <td>{percentage('phosphorus', 'normal_requested_all')}</td>
                    <td>{_.get(res, ['phosphorus', 'high_requested_all'], 0) || 0}</td>
                    <td>{percentage('phosphorus', 'high_requested_all')}</td>
                    <td>{_.get(res, ['phosphorus', 'highest_requested_all'], 0) || 0}</td>
                    <td>{percentage('phosphorus', 'highest_requested_all')}</td>
                    <td>{getAverage('phosphorus')}</td>
                  </tr>
                </tbody>

                <thead>
                  <tr>
                    <th colSpan={13}>
                      Тупроқларининг алмашувчан калий билан таъминланиш <br />
                      <b>ДАРАЖАЛАРИ</b>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={3}>№</th>
                    <th rowSpan={3}>Текширилган майдон, га</th>
                    <th colSpan={10}>КАЛИЙ миқдори, мг/кг</th>
                    <th rowSpan={3}>Ўртача қиймат, мг/кг</th>
                  </tr>
                  <tr>
                    <th bgcolor={tdColors[0]} colSpan={2}>
                      Жуда кам
                      <br />
                      0-100
                    </th>
                    <th bgcolor={tdColors[1]} colSpan={2}>
                      Кам
                      <br />
                      101-200
                    </th>
                    <th bgcolor={tdColors[2]} colSpan={2}>
                      Ўртача
                      <br />
                      201-300
                    </th>
                    <th bgcolor={tdColors[3]} colSpan={2}>
                      Юқори
                      <br />
                      301-400
                    </th>
                    <th bgcolor={tdColors[4]} colSpan={2}>
                      Жуда юқори
                      <br />
                      400&lt;
                    </th>
                  </tr>
                  <tr>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Жами</td>
                    <td>{_.get(res, ['potassium', 'requested_all'], 0) || 0}</td>
                    <td>{_.get(res, ['potassium', 'lowest_requested_all'], 0) || 0}</td>
                    <td>{percentage('potassium', 'lowest_requested_all')}</td>
                    <td>{_.get(res, ['potassium', 'low_requested_all'], 0) || 0}</td>
                    <td>{percentage('potassium', 'low_requested_all')}</td>
                    <td>{_.get(res, ['potassium', 'normal_requested_all'], 0) || 0}</td>
                    <td>{percentage('potassium', 'normal_requested_all')}</td>
                    <td>{_.get(res, ['potassium', 'high_requested_all'], 0) || 0}</td>
                    <td>{percentage('potassium', 'high_requested_all')}</td>
                    <td>{_.get(res, ['potassium', 'highest_requested_all'], 0) || 0}</td>
                    <td>{percentage('potassium', 'highest_requested_all')}</td>
                    <td>{getAverage('potassium')}</td>
                  </tr>
                </tbody>

                <thead>
                  <tr>
                    <th colSpan={13}>
                      Тупроқларининг гумус билан таъминланиш <br />
                      <b>ДАРАЖАЛАРИ</b>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={3}>№</th>
                    <th rowSpan={3}>Текширилган майдон, га</th>
                    <th colSpan={10}>ГУМУС миқдори, фоиз ҳисобида</th>
                    <th rowSpan={3}>Ўртача қиймат, %</th>
                  </tr>
                  <tr>
                    <th bgcolor={tdColors[0]} colSpan={2}>
                      Жуда кам
                      <br />
                      0-0,80
                    </th>
                    <th bgcolor={tdColors[1]} colSpan={2}>
                      Кам
                      <br />
                      0,81-1,20
                    </th>
                    <th bgcolor={tdColors[2]} colSpan={2}>
                      Ўртача
                      <br />
                      1,21-1,60
                    </th>
                    <th bgcolor={tdColors[3]} colSpan={2}>
                      Юқори
                      <br />
                      1,61-2,00
                    </th>
                    <th bgcolor={tdColors[4]} colSpan={2}>
                      Жуда юқори
                      <br />
                      2,00&lt;
                    </th>
                  </tr>
                  <tr>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                    <th>га</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Жами</td>
                    <td>{_.get(res, ['humus', 'requested_all'], 0) || 0}</td>
                    <td>{_.get(res, ['humus', 'lowest_requested_all'], 0) || 0}</td>
                    <td>{percentage('humus', 'lowest_requested_all')}</td>
                    <td>{_.get(res, ['humus', 'low_requested_all'], 0) || 0}</td>
                    <td>{percentage('humus', 'low_requested_all')}</td>
                    <td>{_.get(res, ['humus', 'normal_requested_all'], 0) || 0}</td>
                    <td>{percentage('humus', 'normal_requested_all')}</td>
                    <td>{_.get(res, ['humus', 'high_requested_all'], 0) || 0}</td>
                    <td>{percentage('humus', 'high_requested_all')}</td>
                    <td>{_.get(res, ['humus', 'highest_requested_all'], 0) || 0}</td>
                    <td>{percentage('humus', 'highest_requested_all')}</td>
                    <td>{getAverage('humus')}</td>
                  </tr>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Preloader>
  );
};

export default Dashboard;
