import axios from 'axios';

const accessToken = "{Y7MICGUK05Z9X8TSA1Q4EVFB2}";
const instanceId = "{MMAU000Z87}";
const baseUri = "https://www.whatsautobot.in/send";

export const sendWhatsappSMS = async ({ mobile, message, dialCode = null }) => {
  mobile = `${dialCode == null ? "+91" : dialCode}` + mobile;
  console.log(
    `${baseUri}?instance_id=${instanceId}&access_token=${accessToken}&type=text&number=${mobile}&message=${message}`
  );
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUri}?instance_id=${instanceId}&access_token=${accessToken}&type=text&number=${mobile}&message=${message}`,
    headers: {},
  };

  const resp = await axios
    .request(config)
    .then((response) => {
      //console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      return response.error;
    });
  return resp;
};

export const generateOtp = () => {
  const min = 100000,
    max = 999999;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

