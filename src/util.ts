export const formData = (data: any): FormData => {
  const formData = new FormData();
  for (const k of Object.keys(data)) formData.append(k, data[k]);
  return formData;
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
