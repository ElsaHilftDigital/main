import React from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';

const SearchBox = (props) => {
	return (<Typeahead
		id="SearchBox"
		options={props.items}
		onChange={(selected) => {
			props.onChange(selected[0]);
		}}
		filterBy={(option, filterProps) => props.filter(option, filterProps.text)}
		renderMenuItemChildren={(option, searchProps) => props.renderItem(option, searchProps.text)}
		labelKey={() => ""}
		/>);
};

export default SearchBox;