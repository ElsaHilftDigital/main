import React from 'react';

interface Props {
    value: string,
    bottom?: boolean,
}

const StatusIndicator: React.FC<Props> = (props) => {
    const color = ((col) => {
        switch (col) {
            case "RED":
                return 'danger';
            case "AMBER":
                return 'warning';
            case "GREEN":
                return 'success';
            default:
                return 'error';
        }
    })(props.value);
    if (props.bottom) {
        return <span className={`text-${color} fa fa-circle`} style={{ verticalAlign: 'bottom' }} />;
    }
    return <span className={`text-${color} fa fa-circle`} />;
};

export default StatusIndicator;