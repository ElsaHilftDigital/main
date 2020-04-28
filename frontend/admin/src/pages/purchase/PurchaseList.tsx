import React, {useMemo, useState} from 'react';
import {Col, Container, Dropdown, Form, InputGroup, ListGroup, Row} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';

import {usePurchases} from 'hooks/usePurchases';
import * as routes from 'routes';
import {formatBoolean, formatDateTime, formatMoment, parseDate} from 'config/utils';
import StatusIndicator from 'components/StatusIndicator';
import Title from 'components/Title';
import moment from "moment";
import Header from "components/Header";

const PurchaseList = () => {
    const {purchases} = usePurchases();

    if (!purchases?.length) {
        return (<>
            <Header/>
            <Container fluid>
                <FlexRow>
                    <DateCol md="4">
                        <Title>Datum</Title>
                    </DateCol>
                    <Col>
                        <div className="row">
                            <div className="flex-column">
                                <Title>Aufträge</Title>
                            </div>
                        </div>
                        <ListGroup.Item>
                            <Row><b style={{padding: "1rem"}}>Keine Aufträge vorhanden</b></Row>
                        </ListGroup.Item>
                    </Col>
                </FlexRow>
            </Container>
        </>);
    }

    return (<>
        <Header/>
        <Container fluid>
            <PurchaseListInternal purchases={purchases}/>
        </Container>
    </>);
};

const PurchaseListHeader = () => {
    return <>
        <Row>
            <Col>
                <Title>Aufträge</Title>
            </Col>
            <ExportForm/>
        </Row>
    </>;
}

const ExportForm = () => {
    const today = new Date(Date.now()).toLocaleDateString('de-DE');

    const [startDate, setStartDate] = useState("01.01.2020");
    const [endDate, setEndDate] = useState(today);
    const [startDateValid, setStartDateValid] = useState(true);
    const [endDateValid, setEndDateValid] = useState(true);

    const handleStartDateUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
    };

    const validateStartDate = () => {
        setStartDateValid(!!parseDate(startDate));
    }

    const handleEndDateUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    };

    const validateEndDate = () => {
        setEndDateValid(!!parseDate(endDate));
    }

    const exportPurchases = () => {
        window.location.href = routes.purchaseExportAll(parseDate(startDate)!, parseDate(endDate)!);
    }

    const exportReceipts = () => {
        window.location.href = routes.receiptExport(parseDate(startDate)!, parseDate(endDate)!);
    }

    return <Form inline>
        <Form.Row className="mr-0">
            <Col>
                <Form.Group>
                    <Form.Label srOnly htmlFor="startDate">Startdatum</Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>von</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            id="startDate"
                            type="text"
                            value={startDate}
                            onChange={handleStartDateUpdate}
                            onBlur={validateStartDate}
                            isInvalid={!startDateValid}
                        />
                    </InputGroup>
                    <div className="invalid-tooltip" style={{display: 'block'}} hidden={startDateValid}>
                        Datumsformat: DD.MM.YYYY
                    </div>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group>
                    <Form.Label srOnly htmlFor="endDate">Enddatum</Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>bis</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            id="endDate"
                            type="text"
                            value={endDate}
                            onChange={handleEndDateUpdate}
                            onBlur={validateEndDate}
                            isInvalid={!endDateValid}
                        />
                    </InputGroup>
                    <div className="invalid-tooltip" style={{display: 'block'}} hidden={endDateValid}>
                        Datumsformat: DD.MM.YYYY
                    </div>
                </Form.Group>
            </Col>

            <Col md="auto" className="mr-3">
                <Dropdown alignRight>
                    <Dropdown.Toggle disabled={!(endDateValid && startDateValid)} id="export">Export</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={exportPurchases}>Einkäufe</Dropdown.Item>
                        <Dropdown.Item onClick={exportReceipts}>Quittungen</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
        </Form.Row>
    </Form>

};

const statusIndicators = ["RED", "AMBER", "GREEN"];

const PurchaseListInternal = (props: any) => {
    const {purchases} = props;

    function toDate(timestamp: string): string {
        return formatMoment(moment(timestamp));
    }

    const purchaseDates: string[] = useMemo(() => Array.from(new Set<string>(purchases.map((purchase: any) => toDate(purchase.createdAt))))
        .sort()
        .reverse(), [purchases]);
    const purchasesByDate = useMemo(() => {
        const result: Map<string, any[]> = new Map<string, any[]>(purchaseDates.map(date => [date, []]));
        purchases.forEach((purchase: any) => result.get(toDate(purchase.createdAt))!.push(purchase));
        for (const list of Array.from(result.values())) {
            list.sort((l: any, r: any) => {
                const leftIndex = statusIndicators.indexOf(l.statusIndicator);
                const rightIndex = statusIndicators.indexOf(r.statusIndicator);
                if (leftIndex < rightIndex) {
                    return -1;
                } else if (leftIndex === rightIndex) {
                    if (new Date(l.createdAt) < new Date(r.createdAt)) {
                        return -1;
                    } else {
                        return 1;
                    }
                } else {
                    return 1;
                }
            });
        }
        return result;
    }, [purchaseDates, purchases]);
    const purchaseDateIndicators = useMemo(() => purchaseDates.map(date => {
        const index = purchasesByDate.get(date)!.reduce((acc, current) => Math.min(acc, statusIndicators.indexOf(current.statusIndicator)), statusIndicators.length);
        return statusIndicators[index];
    }), [purchaseDates, purchasesByDate]);


    const [selectedDate, setSelectedDate] = useState(purchaseDates[0]);

    return (<>
        <FlexRow>
            <DateCol md="4">
                <Title>Datum</Title>
                <DateListGroup variant="flush">
                    {purchaseDates.map((date, i) => {
                        return <ListGroup.Item key={i} action active={date === selectedDate}
                                               onClick={() => setSelectedDate(date)}>
                            {date}
                            <div className="float-right"><StatusIndicator value={purchaseDateIndicators[i]}/></div>
                        </ListGroup.Item>;
                    })}
                </DateListGroup>
            </DateCol>
            <Col>
                <PurchaseListHeader/>
                <ListGroup variant="flush">
                    <ListGroup.Item className="pl-3">
                        <Row>
                            <Col><h3>Kunde</h3></Col>
                            <Col><h3>Helfer</h3></Col>
                            <Col><h3>Status</h3></Col>
                            <Col><h3>Moderator</h3></Col>
                        </Row>
                    </ListGroup.Item>
                    {purchasesByDate.get(selectedDate)!.map(p => <PurchaseListItem purchase={p} key={p.uuid}/>)}
                </ListGroup>
            </Col>
        </FlexRow>
    </>)
};

const DateCol = styled(Col)`
    position: sticky;
    top: 5rem;
    height: calc(100vh - 6rem);
    padding-left: 0;
    padding-right: 0;
    flex: 0 1 15vw;
`;

const FlexRow = styled(Row)`
    flex-wrap: nowrap !important;
`;

const DateListGroup = styled(ListGroup)`
    max-height: calc(100vh - 11rem);
    display: block !important;
    overflow-y: auto;
`;

const PurchaseListItem = (props: any) => {
    const {purchase} = props;
    const history = useHistory();
    const labelWidth = 5;

    return <ListGroup.Item action onClick={() => history.push(routes.purchaseDetails(purchase.uuid))}>
        <Row>
            <Col>
                <Row>
                    <Form.Label column md={labelWidth}>Name</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.customer.name}/>
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Telefon</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.customer.phone}/>
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Erstellt</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={formatDateTime(purchase.createdAt)}/>
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Form.Label column md={labelWidth}>Name</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.volunteer?.name}/>
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Telefon</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.volunteer?.phone}/>
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Einkauf bis</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.deadline}/>
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Form.Label column md={labelWidth}>Zustand</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.status}/>
                    </Col>
                    <Col md="2">
                        <StatusIndicator bottom value={purchase.statusIndicator}/>
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Betrag</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.cost}/>
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Betrag beglichen</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={formatBoolean(purchase.paid)}/>
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Form.Label column md={labelWidth}>Erstellt von</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.createdBy}/>
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Verantwortlich</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.responsible}/>
                    </Col>
                </Row>
            </Col>
        </Row>
    </ListGroup.Item>;
};

export default PurchaseList;
