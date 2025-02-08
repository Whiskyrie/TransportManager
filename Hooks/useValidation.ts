import { useState } from 'react';
import { ValidationItem } from 'Types/validationTypes';

export const useValidation = () => {
  const [emailValidations, setEmailValidations] = useState<ValidationItem[]>([
    { isValid: false, message: "Formato de email válido" },
    { isValid: false, message: "Email não pode estar vazio" },
    { isValid: false, message: "Email não pode ter mais de 255 caracteres" },
  ]);

  const [passwordValidations, setPasswordValidations] = useState<ValidationItem[]>([
    { isValid: false, message: "Mínimo de 8 caracteres" },
    { isValid: false, message: "Pelo menos uma letra maiúscula" },
    { isValid: false, message: "Pelo menos uma letra minúscula" },
    { isValid: false, message: "Pelo menos um número" },
    { isValid: false, message: "Pelo menos um caractere especial" },
  ]);

  const [nameValidations, setNameValidations] = useState<ValidationItem[]>([
    { isValid: false, message: "Nome não pode estar vazio" },
    { isValid: false, message: "Mínimo de 3 caracteres" },
    { isValid: false, message: "Apenas letras e espaços" },
  ]);

  const [phoneValidations, setPhoneValidations] = useState<ValidationItem[]>([
    { isValid: false, message: "Formato válido: (99) 99999-9999" },
    { isValid: false, message: "Apenas números são permitidos" },
    { isValid: false, message: "Deve conter 11 dígitos" },
  ]);

  const [plateValidations, setPlateValidations] = useState<ValidationItem[]>([
    { isValid: false, message: "Placa no formato correto (ABC1234 ou ABC1D23)" },
    { isValid: false, message: "Placa não pode estar vazia" },
  ]);

  const [yearValidations, setYearValidations] = useState<ValidationItem[]>([
    { isValid: false, message: "Ano deve ser um número válido" },
    { isValid: false, message: "Ano deve estar entre 1900 e o ano atual" },
  ]);

  const [licenseValidations, setLicenseValidations] = useState<ValidationItem[]>([
    { isValid: false, message: "CNH não pode estar vazia" },
    { isValid: false, message: "CNH deve ter 11 dígitos" },
    { isValid: false, message: "CNH deve conter apenas números" }
  ]);

  const [locationValidations, setLocationValidations] = useState<ValidationItem[]>([
    { isValid: false, message: "Endereço não pode estar vazio" },
    { isValid: false, message: "Endereço deve ter pelo menos 5 caracteres" }
  ]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    setEmailValidations([
      { isValid: emailRegex.test(email), message: "Formato de email válido" },
      { isValid: email.length > 0, message: "Email não pode estar vazio" },
      { isValid: email.length <= 255, message: "Email não pode ter mais de 255 caracteres" },
    ]);
  };

  const validatePassword = (password: string) => {
    setPasswordValidations([
      { isValid: password.length >= 8, message: "Mínimo de 8 caracteres" },
      { isValid: /[A-Z]/.test(password), message: "Pelo menos uma letra maiúscula" },
      { isValid: /[a-z]/.test(password), message: "Pelo menos uma letra minúscula" },
      { isValid: /[0-9]/.test(password), message: "Pelo menos um número" },
      { isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password), message: "Pelo menos um caractere especial" },
    ]);
  };

  const validateName = (name: string) => {
    const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    
    setNameValidations([
      { isValid: name.length > 0, message: "Nome não pode estar vazio" },
      { isValid: name.length >= 3, message: "Mínimo de 3 caracteres" },
      { isValid: nameRegex.test(name), message: "Apenas letras e espaços" },
    ]);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
    const numbersOnly = phone.replace(/\D/g, '');
    
    setPhoneValidations([
      { isValid: phoneRegex.test(phone), message: "Formato válido: (99) 99999-9999" },
      { isValid: /^\d*$/.test(numbersOnly), message: "Apenas números são permitidos" },
      { isValid: numbersOnly.length === 11, message: "Deve conter 11 dígitos" },
    ]);
  };

  const validatePlate = (plate: string) => {
    const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
    
    setPlateValidations([
      { isValid: plateRegex.test(plate), message: "Placa no formato correto (ABC1234 ou ABC1D23)" },
      { isValid: plate.length > 0, message: "Placa não pode estar vazia" },
    ]);
  };

  const validateYear = (year: string) => {
    const currentYear = new Date().getFullYear();
    const yearNumber = parseInt(year);
    
    setYearValidations([
      { isValid: !isNaN(yearNumber), message: "Ano deve ser um número válido" },
      { 
        isValid: yearNumber >= 1900 && yearNumber <= currentYear, 
        message: "Ano deve estar entre 1900 e o ano atual" 
      },
    ]);
  };

  const validateLicense = (license: string) => {
    const numbersOnly = license.replace(/\D/g, '');
    
    setLicenseValidations([
      { isValid: license.length > 0, message: "CNH não pode estar vazia" },
      { isValid: numbersOnly.length === 11, message: "CNH deve ter 11 dígitos" },
      { isValid: /^\d+$/.test(numbersOnly), message: "CNH deve conter apenas números" }
    ]);
  };

  const validateLocation = (location: string) => {
    setLocationValidations([
      { isValid: location.length > 0, message: "Endereço não pode estar vazio" },
      { isValid: location.length >= 5, message: "Endereço deve ter pelo menos 5 caracteres" }
    ]);
  };

  const isEmailValid = () => emailValidations.every(v => v.isValid);
  const isPasswordValid = () => passwordValidations.every(v => v.isValid);
  const isNameValid = () => nameValidations.every(v => v.isValid);
  const isPhoneValid = () => phoneValidations.every(v => v.isValid);
  const isPlateValid = () => plateValidations.every(v => v.isValid);
  const isYearValid = () => yearValidations.every(v => v.isValid);
  const isLicenseValid = () => licenseValidations.every(v => v.isValid);
  const isLocationValid = () => locationValidations.every(v => v.isValid);

  return {
    emailValidations,
    passwordValidations,
    nameValidations,
    phoneValidations,
    plateValidations,
    yearValidations,
    licenseValidations,
    locationValidations,
    validateEmail,
    validatePassword,
    validateName,
    validatePhone,
    validatePlate,
    validateYear,
    validateLicense,
    validateLocation,
    isEmailValid,
    isPasswordValid,
    isNameValid,
    isPhoneValid,
    isPlateValid,
    isYearValid,
    isLicenseValid,
    isLocationValid,
  };
};