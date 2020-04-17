import React from 'react';
import { useHistory } from 'react-router-dom';
import { useCustomers } from 'hooks/useCustomers';

import * as routes from 'routes';
import Title from 'components/Title';
import { ListGroup } from 'react-bootstrap';

const CustomerList: React.FC = () => {
    const { customers } = useCustomers();

    if (!customers.length) {
        return (
            <span>
                <span className="list-header mt-3 mb-2">Kunden</span>
                <ul className="sidebar-nav">
                    Keine Kunden
                </ul>
            </span>
        );
    }

    return (
        <>
            <Title>Kunden</Title>
            <ListGroup>
                {customers.map((customer: any) => <CustomerListItem key={customer.uuid} customer={customer}/>)}
            </ListGroup>
        </>
    );
};

interface ListItemProps {
    customer: any,
}

const CustomerListItem: React.FC<ListItemProps> = props => {
    const { customer } = props;
    const history = useHistory();

    return <ListGroup.Item action
                           onClick={() => history.push(routes.customerDetails(customer.uuid))}>
        {customer.lastName}
    </ListGroup.Item>;
};

export default CustomerList;
