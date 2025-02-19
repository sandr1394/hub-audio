import React from 'react';
import MaskedInput, { conformToMask } from 'react-text-mask';
import { TextField, TextFieldProps } from '@mui/material';

const mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
const mask11 = ['+', /1/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

const PhoneMask = React.forwardRef<MaskedInput>(function PhoneMask(props, inputRef: any) {
  return (
    <MaskedInput
      {...props}
      ref={(ref: any) => inputRef(ref ? ref.inputElement : null)}
      guide={false}
      mask={mask}
      pipe={(value) => value.replace(/(?!\d)[^\d]*$/, '')}
    />
  );
});

export const phoneMask = (value: string) =>
  conformToMask(value, value.length === 11 ? mask11 : mask, { guide: false }).conformedValue;

const retrievePhoneNumberFromMask = (value: string) => value.replace(/[^\d]/g, '');

function PhoneInput({ onBlur, onChange, ...other }: TextFieldProps & { id: string; name: string }) {
  return (
    <TextField
      label={other.label || 'Phone Number'}
      variant="outlined"
      type="tel"
      {...other}
      onChange={(e) => {
        // TODO ugly solution
        if (onChange)
          onChange({
            ...e,
            target: {
              ...e.target,
              value: retrievePhoneNumberFromMask(e.target.value),
              id: other.id,
              name: other.name,
            },
          });
      }}
      onBlur={(e: any) => {
        // TODO ugly solution
        if (onBlur)
          onBlur({
            ...e,
            target: {
              ...e.target,
              value: retrievePhoneNumberFromMask(e.target.value),
              id: other.id,
              name: other.name,
            },
          });
      }}
      InputProps={{
        inputComponent: PhoneMask as any,
      }}
    />
  );
}

export default PhoneInput;
