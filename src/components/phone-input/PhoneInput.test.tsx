import React from 'react';
import { mount } from '@cypress/react';
import PhoneInput from './PhoneInput';

describe('PhoneInput', () => {
  it('should apply mask', () => {
    const onChange = cy.stub();
    const onBlur = cy.stub();
    mount(<PhoneInput id="phone" name="phone" onChange={onChange} onBlur={onBlur} />);
    cy.get('input').type('av690cz444sad./-5728-9asd');
    cy.get('input')
      .should('have.value', '(690) 444-5728')
      .then(() => {
        expect(onChange).to.have.callCount(25);
        expect(onChange).to.be.calledWithMatch({
          target: { value: '6904445728', id: 'phone', name: 'phone' },
        });
      });
    cy.get('input').blur();
    cy.get('input')
      .should('have.value', '(690) 444-5728')
      .then(() => {
        expect(onBlur).to.be.calledOnce;
        expect(onBlur).to.be.calledWithMatch({
          target: { value: '6904445728', id: 'phone', name: 'phone' },
        });
      });
  });

  it('should not guide', () => {
    const onChange = cy.stub();
    mount(<PhoneInput id="phone" name="phone" onChange={onChange} onBlur={() => {}} />);

    cy.get('input').type('1234');
    cy.get('input')
      .should('have.value', '(123) 4')
      .then(() => {
        expect(onChange).to.have.callCount(4);
        expect(onChange).to.be.calledWithMatch({
          target: { value: '1234', id: 'phone', name: 'phone' },
        });
      });
  });
});
