import React, { useEffect, useState, useContext } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { Input, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import AuthContext from '../../../store/auth-context';
import queryString from 'query-string';
import _ from 'lodash';
import PaginationC from 'react-js-pagination';
import moment from 'moment';
import { fetchRequest } from '../../../helpers/createRequest';
import './results.css';
import { Loader } from '../../../vibe';

const Results = (props, { location }) => {
  const [samples, setSamples] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const queryParams = queryString.parse(window.location.search);
  const ctx = useContext(AuthContext);

  const getSamples = async () => {
    setIsLoading(true);
    const samples = await fetchRequest
      .get('samples', {
        params: {
          page: queryParams.page,
          crop_type: queryParams.crop_type,
          calculation_region: queryParams.calculation_region,
          outline_number: queryParams.outline_number,
        },
      })
      .then(res => res.data)
      .catch(e => {
        alert('Натижалар топилмади!');
      });
    setIsLoading(false);
    return samples;
  };

  useEffect(async () => {
    if (ctx.isLoggedIn) {
      const samplesData = await getSamples();
      // setSamples(samplesData.results);
      // setCount(samplesData.count);
      if (samplesData) {
        setSamples(samplesData.results);
        setCount(samplesData.count);
      }
    }
  }, [queryParams.page, queryParams.crop_type, queryParams.calculation_region, queryParams.outline_number]);

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

  const onPageChange = nextPage => {
    props.history.push({ search: queryString.stringify({ ...queryParams, page: nextPage }, { skipNull: true }) });
  };

  const deleteSample = async s => {
    if (window.confirm('Намуна натижасини ўчиришни хохлайсизми?')) {
      await fetchRequest.delete('samples/' + s.id).then(res => {
        if (res.status == 204) {
          setSamples(samples.filter(item => item.id != s.id));
        }
      });
    }
  };

  // const checkDateForDelete = createdAt => {
  //   if (moment(createdAt).isAfter(moment().subtract(1, 'hours'))) {
  //     return true;
  //     console.log(true);
  //   } else {
  //     return false;
  //     console.log(false);
  //   }
  // };

  const onExport = async () => {
    const res = await fetchRequest
      .get('excel/samples', {
        responseType: 'blob', // important
        params: queryParams,
      })
      .then(response => {
        // const headerLine = response.data.headers['content-disposition']
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Натижалар.xls');
        document.body.appendChild(link);
        link.click();
        link.remove();
        return 1;
      });
  };
  return (
    <Col md="12">
      {ctx.role == 0 && (
        <Row className="mb-3">
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
              value={queryParams.crop_type || ''}
              className="form-control"
              id="crop_type"
              onChange={e => onFilter(e.target.value, 'crop_type')}
            >
              <option value={''}>Экин тури</option>
              {ctx.crops &&
                ctx.crops.map((crp, idx) => {
                  return (
                    <option key={idx} value={crp.id}>
                      {crp.name_uz}
                    </option>
                  );
                })}
            </select>
          </Col>

          <Col lg="3" md="12" className="mb-2">
            <Input
              value={queryParams.outline_number || ''}
              type="text"
              id="outline_number"
              onChange={e => onFilter(e.target.value, 'outline_number')}
              placeholder="Контур рақами"
            />
          </Col>

          <Col lg="1" md="12" className="mb-2">
            {/* <Button color="success" style={{ boxShadow: 'none' }} className="form-control" onClick={searchData}>
          <i className="fa fa-search text-white" />
        </Button> */}
            {(!_.isEmpty(queryParams.outline_number) ||
              !_.isEmpty(queryParams.crop_type) ||
              !_.isEmpty(queryParams.calculation_region)) && (
              <Button
                onClick={() => props.history.push({ search: queryString.stringify({}) })}
                className="pull-right mr-3 text-white"
                color="danger"
              >
                <i className="fa fa-remove"></i>
              </Button>
            )}
          </Col>
        </Row>
      )}

      <Row className="mb-2">
        <Col lg="4" md="12">
          <button onClick={onExport} className="btn btn-info">
            <i className="fa fa-file-text" /> Файл юклаб олиш (.xls)
          </button>
        </Col>
      </Row>
      <div className="table-flow">
        {!isLoading ? (
          <Table className="table-result" responsive={true}>
            <thead>
              <tr>
                <th>#</th>
                <th>Намуна идентификацион рақами</th>
                <th>Вилоят</th>
                <th>Контур рақами</th>
                <th>Майдон, га</th>
                <th>Экин тури</th>
                <th>Сана</th>
                <th>Маълумот</th>
                <th>Ўчириш</th>
              </tr>
            </thead>
            <tbody>
              {samples
                ? samples.map((smp, idx) => {
                    return (
                      <tr key={idx}>
                        <td>{smp.id}</td>
                        <td width={10}>{smp.sample_number}</td>
                        <td>{smp.name_calculation_region}</td>
                        <td>{smp.outline_number}</td>
                        <td>{smp.area}</td>
                        <td>{smp.name_crop_type}</td>
                        <td>{smp.added_at}</td>
                        <td>
                          <Link to={`/results/${smp.id}`} className="btn btn-success my-0 d-inline-block">
                            <i className="fa fa-arrow-circle-right"></i>
                          </Link>
                        </td>
                        <td>
                          <Button
                            className="btn btn-danger my-0"
                            color="danger"
                            onClick={e => deleteSample(smp)}
                            disabled={!moment(smp.updated_at).isAfter(moment().subtract(1, 'hours'))}
                          >
                            <i className="fa fa-trash white" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                : ''}
            </tbody>
          </Table>
        ) : (
          <Loader type="spin" />
        )}
      </div>
      {!isLoading && (
        <PaginationC
          activePage={parseInt(queryParams.page || 1)}
          itemsCountPerPage={10}
          totalItemsCount={count}
          pageCount={Math.ceil(parseInt(count) / 10)}
          pageRangeDisplayed={3}
          itemClass={`page-item`}
          linkClass={`page-link`}
          onChange={p => onPageChange(p)}
        />
      )}
    </Col>
  );
};

export default Results;
