import { useState } from 'react';

const useForm = (fields, cb, initials) => {
  const defaults = fields.reduce((acc, val) => {
    return { ...acc, [val]: initials && initials[val] ? initials[val] : '' };
  }, {});

  const [values, setValues] = useState(defaults);

  const handleSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    cb(values);
  };

  const handleChange = e => {
    e.persist();
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return {
    values,
    handleSubmit,
    handleChange,
  };
};

export default useForm;
