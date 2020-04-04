import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    border: 1px solid #ccd4da !important;
    border-radius: 0.25rem !important;
    padding: 0 0.25rem !important;

    :focus-within {
        border-color: #6a6acb !important;
        outline: 0;
        box-shadow: 0 00 0 0.2rem rgba(47, 47, 134, 0.25);
    }
`;


const SearchBox = () => {
    return (
        <Container className="input-group">
            <div className="input-group-prepend">
                <i class="fa fa-search" style={{margin: 'auto 0', zIndex: 1000}}/>
            </div>
            <input type="search" className="form-control" style={{border: 'none', outline: 'none', boxShadow: 'none'}}/>
        </Container>
    );
};

export default SearchBox;