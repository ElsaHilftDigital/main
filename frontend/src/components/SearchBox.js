import React from 'react';
import styled from 'styled-components';
import useConstant from 'use-constant';

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

//function debounce(fn, delay) {
//	let timeoutId;
//	return function (t) {
//		clearTimeout(timeoutId);
//		timeoutId = setTimeout(() => fn(t), delay);
//	};
//}

// function compose(fn, mapper) {
// 	return function (u) {
//		fn(mapper(u));
//	}
//}

function deduplicate(fn) {
	let cacheValue;
	return function (t) {
		if (cacheValue !== t) {
			fn(t);
		}
		cacheValue = t;
	}
}

const doNothing = () => {};

const SearchBox = (props) => {
    const onChange = useConstant(() => deduplicate(props.onChange ?? doNothing));
    //const debouncedOnChange = useConstant(() => debounce(onChange, 500));

    //const changeHandler = (e) => {
	//	debouncedOnChange(e.target.value);
	//};

	const keyDownHandler = (e) => {
		if (e.key === "Enter") {
			const value = e.currentTarget.value;
			onChange(value);
		}
    };

    return (
        <Container className="input-group">
            <div className="input-group-prepend">
                <i class="fa fa-search" style={{margin: 'auto 0', zIndex: 1000}}/>
            </div>
            <input onChange={onChange} onKeyDown={keyDownHandler} type="search" className="form-control" style={{border: 'none', outline: 'none', boxShadow: 'none'}}/>
        </Container>
    );
};

export default SearchBox;