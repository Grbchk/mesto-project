export { configs };

const token = '001ad720-6ef4-4b0d-b9d3-4ac6fa30aca0';
const cohort = 'plus-cohort-4';
const url = 'https://mesto.nomoreparties.co/v1/'+cohort;

const configs = {
  baseUrl: url,
  headers: {
    authorization: token,
    'Content-Type': 'application/json',
  }
};
