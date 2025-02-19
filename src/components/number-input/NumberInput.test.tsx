import React from 'react';
import { mount } from '@cypress/react';
import NumberInput from './NumberInput';

describe('NumberInput', () => {
  it('should apply mask', () => {
    const onChange = cy.stub();
    const onBlur = cy.stub();
    mount(<NumberInput id="num" name="num" maxLength={20} onChange={onChange} onBlur={onBlur} />);
    cy.get('input').type('av690cz444sad./-5728-9asd');
    cy.get('input')
      .should('have.value', '69044457289')
      .then(() => {
        expect(onChange).to.have.callCount(25);
        expect(onChange).to.be.calledWithMatch({
          target: { value: '69044457289', id: 'num', name: 'num' },
        });
      });
    cy.get('input').blur();
    cy.get('input')
      .should('have.value', '69044457289')
      .then(() => {
        expect(onBlur).to.be.calledOnce;
        expect(onBlur).to.be.calledWithMatch({
          target: { value: '69044457289', id: 'num', name: 'num' },
        });
      });
  });

  it('should ignore negative numbers', () => {
    const onChange = cy.stub();
    mount(<NumberInput id="num" name="num" maxLength={20} onChange={onChange} onBlur={() => {}} />);

    cy.get('input').type('-1234');
    cy.get('input')
      .should('have.value', '1234')
      .then(() => {
        expect(onChange).to.have.callCount(5);
        expect(onChange).to.be.calledWithMatch({
          target: { value: '1234', id: 'num', name: 'num' },
        });
      });
  });

  it('should ignore scientific notation, commas and dots', () => {
    const onChange = cy.stub();
    mount(<NumberInput id="num" name="num" maxLength={20} onChange={onChange} onBlur={() => {}} />);

    cy.get('input').type('1.34E+2,3');
    cy.get('input')
      .should('have.value', '13423')
      .then(() => {
        expect(onChange).to.have.callCount(9);
        expect(onChange).to.be.calledWithMatch({
          target: { value: '13423', id: 'num', name: 'num' },
        });
      });
  });

  it('should apply maxLength', () => {
    const onChange = cy.stub();
    mount(<NumberInput id="num" name="num" maxLength={5} onChange={onChange} onBlur={() => {}} />);

    cy.get('input').type('1234567');
    cy.get('input')
      .should('have.value', '12345')
      .then(() => {
        expect(onChange).to.have.callCount(5);
        expect(onChange).to.be.calledWithMatch({
          target: { value: '12345', id: 'num', name: 'num' },
        });
      });
  });
});
