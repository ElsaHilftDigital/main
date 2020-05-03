import React, { Children, ReactElement, useState } from 'react';
import styled from 'styled-components';

interface WizardStepProps {
    name: string,
    children?: ReactElement,
}

export const WizardStep: React.FC<WizardStepProps> = () => null;
type StepElement = ReactElement<WizardStepProps>

interface Props {
    children: StepElement | StepElement[],
}

const Wizard: React.FC<Props> = props => {
    const [step, setStep] = useState(0);
    const previous = () => setStep(step => step - 1);
    const next = () => setStep(step => step + 1);
    const children = Children.toArray(props.children) as StepElement[];
    const activeStep = children[step].props.children!;

    return <>
        <StepIndicator>
            {children.map((el, idx) =>
                <Step key={idx}
                      name={el.props.name}
                      completed={idx < step}
                      active={idx === step}
                />)}
        </StepIndicator>
        <activeStep.type {...activeStep.props} previous={previous} next={next}/>
    </>;
};

export default Wizard;

const StepIndicator: React.FC = styled.ol`
    list-style: none;
    margin: 4rem 0 2rem;
    padding: 0;
    display: table;
    table-layout: fixed;
    width: 100%;
`;

interface StepProps {
    name: string,
    active: boolean,
    completed: boolean,
}

const IndicatorItem = styled.li`
    position: relative;
    display: table-cell;
    text-align: center;
    font-weight: ${(props: any) => props.active ? 'bold' : 'normal'};
        
    &:before {
        content: '';
        display: block;
        margin: 0 auto;
        background: ${(props: any) => (props.active || props.completed) ? '#2f2f86' : '#6c757d'};
        width: 1em;
        height: 1em;
        margin-bottom: 1em;
        line-height: 4em;
        border-radius: 100%;
        position: relative;
        z-index: 1000;
    }
    &:after {
        content: '';
        position: absolute;
        display: block;
        background: ${(props: any) => props.completed ? '#2f2f86' : '#6c757d'};
        width: 100%;
        height: 0.25em;
        top: 0.375em;
        left: 50%;
        margin-left: 0.5em;
        z-index: -1;
        color: white;
    }
    &:last-child:after {
        display: none;
    }
`;

const Step: React.FC<StepProps> = props => <>
    <IndicatorItem {...props}>
        <span>{props.name}</span>
    </IndicatorItem>
</>;
