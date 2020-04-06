import React from 'react';
import styled from 'styled-components';
import {hintContainer, Typeahead, Highlighter} from 'react-bootstrap-typeahead';

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

function debounce(fn, delay) {
	let timeoutId;
	return function (t) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(t), delay);
	};
}

function compose(fn, mapper) {
	return function (u) {
		fn(mapper(u));
	}
}

function deduplicate(fn) {
	let cacheValue;
	return function (t) {
		if (cacheValue !== t) {
			fn(t);
		}
		cacheValue = t;
	}
}

const SearchInput = styled.input`
	border: none !important;
	outline: none !important;
	box-shadow: none !important;
`;

const SearchBox = (props) => {
	return (<Typeahead
		id="SearchBox"
		options={props.items}
		onChange={(selected) => {
			props.onChange(selected[0]);
		}}
		renderMenuItemChildren={(option, props, index) => {
			return [
				<div key="name">{option.firstName} {option.lastName}</div>,
				<div key="address">{option.address.address}</div>,
				<div key="address2">{option.address.zipCode} {option.address.city}</div>,
				<div key="phone">{option.phone}{option.mobile && ` / ${option.mobile}`}</div>
			];
		}}
		labelKey="phone"
		/>);
};

export default SearchBox;