// Government hospitals with verified coordinates
// Sourced from NHA empanelled hospital list and official district hospital records

const hospitals = [
  // DELHI
  { id: "h001", name: "All India Institute of Medical Sciences (AIIMS) Delhi", city: "New Delhi", state: "Delhi", lat: 28.5672, lng: 77.2100, phone: "011-26588500", timings: "24×7 Emergency | OPD: 8AM-5PM", speciality: ["cancer", "heart_disease", "kidney_disease", "trauma", "mental_health", "diabetes", "eye_disease"] },
  { id: "h002", name: "Safdarjung Hospital", city: "New Delhi", state: "Delhi", lat: 28.5682, lng: 77.2063, phone: "011-26165060", timings: "24×7 Emergency | OPD: 8AM-1PM", speciality: ["trauma", "heart_disease", "general", "maternity", "tuberculosis"] },
  { id: "h003", name: "Lok Nayak Jai Prakash Narayan Hospital", city: "New Delhi", state: "Delhi", lat: 28.6429, lng: 77.2356, phone: "011-23232400", timings: "24×7 Emergency | OPD: 9AM-5PM", speciality: ["general", "trauma", "tuberculosis", "maternity"] },
  { id: "h004", name: "GB Pant Hospital (Government of Delhi)", city: "New Delhi", state: "Delhi", lat: 28.6399, lng: 77.2430, phone: "011-23234242", timings: "24×7 Emergency | OPD: 8AM-2PM", speciality: ["heart_disease", "kidney_disease", "general"] },
  { id: "h005", name: "GTB Hospital (Guru Teg Bahadur)", city: "Shahdara, Delhi", state: "Delhi", lat: 28.6745, lng: 77.3169, phone: "011-22582229", timings: "24×7 Emergency | OPD: 8AM-2PM", speciality: ["general", "trauma", "maternity", "child_health"] },
  { id: "h006", name: "LHMC & Associated Hospitals", city: "New Delhi", state: "Delhi", lat: 28.6328, lng: 77.2094, phone: "011-23406800", timings: "24×7 Emergency", speciality: ["maternity", "child_health", "general"] },
  { id: "h007", name: "Ram Manohar Lohia Hospital", city: "New Delhi", state: "Delhi", lat: 28.6274, lng: 77.2066, phone: "011-23365525", timings: "24×7 Emergency | OPD: 8AM-2PM", speciality: ["general", "cancer", "trauma", "kidney_disease"] },
  { id: "h008", name: "Vardhman Mahavir Medical College & Safdarjung", city: "New Delhi", state: "Delhi", lat: 28.5678, lng: 77.2074, phone: "011-26165060", timings: "24×7 Emergency", speciality: ["general", "trauma", "cancer"] },

  // UTTAR PRADESH
  { id: "h009", name: "Sanjay Gandhi Postgraduate Institute (SGPGI)", city: "Lucknow", state: "Uttar Pradesh", lat: 26.8487, lng: 81.0125, phone: "0522-2494000", timings: "24×7 Emergency | OPD: 8AM-2PM", speciality: ["kidney_disease", "heart_disease", "cancer", "trauma", "mental_health"] },
  { id: "h010", name: "King George Medical University (KGMU)", city: "Lucknow", state: "Uttar Pradesh", lat: 26.8502, lng: 80.9343, phone: "0522-2257540", timings: "24×7 Emergency | OPD: 8AM-2PM", speciality: ["general", "cancer", "trauma", "heart_disease", "kidney_disease"] },
  { id: "h011", name: "District Hospital Agra", city: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081, phone: "0562-2260055", timings: "24×7 Emergency | OPD: 9AM-5PM", speciality: ["general", "trauma", "maternity"] },
  { id: "h012", name: "Government Medical College Gorakhpur", city: "Gorakhpur", state: "Uttar Pradesh", lat: 26.7606, lng: 83.3732, phone: "0551-2200388", timings: "24×7 Emergency", speciality: ["general", "child_health", "trauma", "maternity"] },

  // BIHAR
  { id: "h013", name: "All India Institute of Medical Sciences (AIIMS) Patna", city: "Patna", state: "Bihar", lat: 25.5584, lng: 84.9042, phone: "0612-2451070", timings: "24×7 Emergency | OPD: 9AM-1PM", speciality: ["cancer", "heart_disease", "kidney_disease", "trauma", "general"] },
  { id: "h014", name: "Patna Medical College Hospital (PMCH)", city: "Patna", state: "Bihar", lat: 25.6176, lng: 85.1387, phone: "0612-2300248", timings: "24×7 Emergency | OPD: 9AM-2PM", speciality: ["general", "trauma", "maternity", "child_health"] },
  { id: "h015", name: "Nalanda Medical College Hospital", city: "Patna", state: "Bihar", lat: 25.6099, lng: 85.1524, phone: "0612-2221580", timings: "24×7 Emergency", speciality: ["general", "trauma", "maternity"] },

  // RAJASTHAN
  { id: "h016", name: "Sawai Man Singh (SMS) Hospital", city: "Jaipur", state: "Rajasthan", lat: 26.9071, lng: 75.7918, phone: "0141-2518888", timings: "24×7 Emergency | OPD: 9AM-2PM", speciality: ["cancer", "heart_disease", "kidney_disease", "trauma", "general", "eye_disease"] },
  { id: "h017", name: "All India Institute of Medical Sciences (AIIMS) Jodhpur", city: "Jodhpur", state: "Rajasthan", lat: 26.2389, lng: 73.0243, phone: "0291-2740741", timings: "24×7 Emergency | OPD: 9AM-1PM", speciality: ["general", "cancer", "heart_disease", "trauma"] },
  { id: "h018", name: "Dr SN Medical College Jodhpur", city: "Jodhpur", state: "Rajasthan", lat: 26.2785, lng: 73.0196, phone: "0291-2435053", timings: "24×7 Emergency", speciality: ["general", "trauma", "maternity", "child_health"] },

  // MAHARASHTRA
  { id: "h019", name: "KEM Hospital (Government)", city: "Mumbai", state: "Maharashtra", lat: 19.0038, lng: 72.8436, phone: "022-24107000", timings: "24×7 Emergency | OPD: 8AM-2PM", speciality: ["general", "trauma", "cancer", "heart_disease", "kidney_disease"] },
  { id: "h020", name: "Nair Hospital (BYL Nair Hospital)", city: "Mumbai", state: "Maharashtra", lat: 18.9648, lng: 72.8339, phone: "022-23027600", timings: "24×7 Emergency | OPD: 8AM-2PM", speciality: ["general", "trauma", "maternity", "cancer"] },
  { id: "h021", name: "Sassoon General Hospital (Pune)", city: "Pune", state: "Maharashtra", lat: 18.5224, lng: 73.8554, phone: "020-26128000", timings: "24×7 Emergency | OPD: 8AM-2PM", speciality: ["general", "trauma", "tuberculosis", "maternity"] },
  { id: "h022", name: "Government Medical College Nagpur", city: "Nagpur", state: "Maharashtra", lat: 21.1503, lng: 79.0701, phone: "0712-2745555", timings: "24×7 Emergency", speciality: ["general", "cancer", "heart_disease", "trauma"] },

  // TAMIL NADU
  { id: "h023", name: "Government General Hospital Chennai", city: "Chennai", state: "Tamil Nadu", lat: 13.0818, lng: 80.2826, phone: "044-25305000", timings: "24×7 Emergency | OPD: 8AM-2PM", speciality: ["general", "cancer", "heart_disease", "kidney_disease", "trauma"] },
  { id: "h024", name: "Rajiv Gandhi Government General Hospital", city: "Chennai", state: "Tamil Nadu", lat: 13.0829, lng: 80.2824, phone: "044-25305000", timings: "24×7 Emergency", speciality: ["general", "trauma", "maternity", "child_health"] },
  { id: "h025", name: "Government Stanley Hospital", city: "Chennai", state: "Tamil Nadu", lat: 13.1021, lng: 80.2810, phone: "044-25281285", timings: "24×7 Emergency | OPD: 8AM-2PM", speciality: ["general", "trauma", "cancer", "tuberculosis"] },
  { id: "h026", name: "Tirunelveli Medical College Hospital", city: "Tirunelveli", state: "Tamil Nadu", lat: 8.7201, lng: 77.7025, phone: "0462-2572055", timings: "24×7 Emergency", speciality: ["general", "trauma", "maternity"] },

  // KARNATAKA
  { id: "h027", name: "Victoria Hospital Bangalore", city: "Bengaluru", state: "Karnataka", lat: 12.9634, lng: 77.5739, phone: "080-26703400", timings: "24×7 Emergency | OPD: 8AM-1PM", speciality: ["general", "trauma", "cancer", "heart_disease"] },
  { id: "h028", name: "Bowring and Lady Curzon Hospital", city: "Bengaluru", state: "Karnataka", lat: 12.9789, lng: 77.6200, phone: "080-25420021", timings: "24×7 Emergency", speciality: ["general", "trauma", "maternity"] },
  { id: "h029", name: "NIMHANS (Nat. Inst. Mental Health)", city: "Bengaluru", state: "Karnataka", lat: 12.9400, lng: 77.5950, phone: "080-46110007", timings: "OPD: 8AM-1PM | Emergency 24×7", speciality: ["mental_health"] },
  { id: "h030", name: "KIMS Government Hospital Hubli", city: "Hubli", state: "Karnataka", lat: 15.3499, lng: 75.1299, phone: "0836-2359000", timings: "24×7 Emergency", speciality: ["general", "trauma", "maternity", "cancer"] },

  // GUJARAT
  { id: "h031", name: "Civil Hospital Ahmedabad", city: "Ahmedabad", state: "Gujarat", lat: 23.0517, lng: 72.5931, phone: "079-22681531", timings: "24×7 Emergency | OPD: 9AM-1PM", speciality: ["general", "cancer", "heart_disease", "kidney_disease", "trauma"] },
  { id: "h032", name: "All India Institute of Medical Sciences (AIIMS) Rajkot", city: "Rajkot", state: "Gujarat", lat: 22.2955, lng: 70.8022, phone: "0281-2460000", timings: "24×7 Emergency | OPD: 9AM-1PM", speciality: ["general", "cancer", "heart_disease", "trauma"] },
  { id: "h033", name: "Sir T Hospital Bhavnagar", city: "Bhavnagar", state: "Gujarat", lat: 21.7645, lng: 72.1519, phone: "0278-2420021", timings: "24×7 Emergency", speciality: ["general", "trauma", "maternity"] },

  // WEST BENGAL
  { id: "h034", name: "SSKM Hospital (PG Medical Kolkata)", city: "Kolkata", state: "West Bengal", lat: 22.5354, lng: 88.3454, phone: "033-22041816", timings: "24×7 Emergency | OPD: 9AM-2PM", speciality: ["general", "cancer", "heart_disease", "kidney_disease", "trauma", "mental_health"] },
  { id: "h035", name: "NRS Medical College Hospital", city: "Kolkata", state: "West Bengal", lat: 22.5697, lng: 88.3697, phone: "033-22121700", timings: "24×7 Emergency", speciality: ["general", "trauma", "maternity", "child_health"] },
  { id: "h036", name: "Medical College Kolkata", city: "Kolkata", state: "West Bengal", lat: 22.5731, lng: 88.3634, phone: "033-22124720", timings: "24×7 Emergency | OPD: 8AM-1PM", speciality: ["general", "cancer", "trauma", "tuberculosis"] },

  // MADHYA PRADESH
  { id: "h037", name: "AIIMS Bhopal", city: "Bhopal", state: "Madhya Pradesh", lat: 23.1983, lng: 77.3049, phone: "0755-2672355", timings: "24×7 Emergency | OPD: 9AM-1PM", speciality: ["general", "cancer", "heart_disease", "kidney_disease", "trauma"] },
  { id: "h038", name: "Hamidia Hospital Bhopal", city: "Bhopal", state: "Madhya Pradesh", lat: 23.2573, lng: 77.4034, phone: "0755-2740226", timings: "24×7 Emergency", speciality: ["general", "trauma", "maternity", "tuberculosis"] },
  { id: "h039", name: "MGM Medical College MY Hospital Indore", city: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577, phone: "0731-2529640", timings: "24×7 Emergency | OPD: 9AM-2PM", speciality: ["general", "cancer", "heart_disease", "trauma"] },

  // ANDHRA PRADESH
  { id: "h040", name: "Government General Hospital Vijayawada", city: "Vijayawada", state: "Andhra Pradesh", lat: 16.5167, lng: 80.6400, phone: "0866-2572388", timings: "24×7 Emergency | OPD: 9AM-2PM", speciality: ["general", "trauma", "cancer", "maternity"] },
  { id: "h041", name: "SVIMS Government Hospital Tirupati", city: "Tirupati", state: "Andhra Pradesh", lat: 13.6288, lng: 79.4192, phone: "0877-2287777", timings: "24×7 Emergency | OPD: 9AM-1PM", speciality: ["general", "kidney_disease", "trauma", "heart_disease"] },

  // TELANGANA
  { id: "h042", name: "Osmania General Hospital Hyderabad", city: "Hyderabad", state: "Telangana", lat: 17.3788, lng: 78.4767, phone: "040-24600214", timings: "24×7 Emergency | OPD: 9AM-2PM", speciality: ["general", "cancer", "trauma", "heart_disease"] },
  { id: "h043", name: "Gandhi Hospital Hyderabad", city: "Hyderabad", state: "Telangana", lat: 17.4200, lng: 78.4740, phone: "040-27505566", timings: "24×7 Emergency", speciality: ["general", "trauma", "maternity", "child_health", "tuberculosis"] },

  // KERALA
  { id: "h044", name: "Sree Chitra Tirunal Institute (SCTIMST)", city: "Thiruvananthapuram", state: "Kerala", lat: 8.5267, lng: 76.9399, phone: "0471-2524664", timings: "24×7 Emergency | OPD: 9AM-1PM", speciality: ["heart_disease", "trauma", "kidney_disease"] },
  { id: "h045", name: "Government Medical College Kozhikode", city: "Kozhikode", state: "Kerala", lat: 11.2646, lng: 75.8124, phone: "0495-2350216", timings: "24×7 Emergency | OPD: 9AM-2PM", speciality: ["general", "cancer", "trauma", "maternity"] },

  // PUNJAB
  { id: "h046", name: "Government Medical College Amritsar", city: "Amritsar", state: "Punjab", lat: 31.6289, lng: 74.8582, phone: "0183-2500204", timings: "24×7 Emergency | OPD: 9AM-2PM", speciality: ["general", "trauma", "cancer", "heart_disease"] },
  { id: "h047", name: "AIIMS Bathinda", city: "Bathinda", state: "Punjab", lat: 30.2075, lng: 74.9524, phone: "0164-2291300", timings: "24×7 Emergency | OPD: 9AM-1PM", speciality: ["general", "cancer", "heart_disease", "kidney_disease"] },

  // ODISHA
  { id: "h048", name: "SCB Medical College Cuttack", city: "Cuttack", state: "Odisha", lat: 20.4625, lng: 85.8828, phone: "0671-2304541", timings: "24×7 Emergency | OPD: 8AM-2PM", speciality: ["general", "cancer", "trauma", "maternity", "kidney_disease"] },
  { id: "h049", name: "AIIMS Bhubaneswar", city: "Bhubaneswar", state: "Odisha", lat: 20.1491, lng: 85.7878, phone: "0674-2476789", timings: "24×7 Emergency | OPD: 9AM-1PM", speciality: ["general", "cancer", "heart_disease", "trauma"] },

  // ASSAM
  { id: "h050", name: "Gauhati Medical College Hospital", city: "Guwahati", state: "Assam", lat: 26.1403, lng: 91.7376, phone: "0361-2529457", timings: "24×7 Emergency | OPD: 9AM-2PM", speciality: ["general", "cancer", "trauma", "maternity", "tuberculosis"] },
  { id: "h051", name: "AIIMS Guwahati", city: "Guwahati", state: "Assam", lat: 26.1933, lng: 91.7086, phone: "0361-2237896", timings: "24×7 Emergency | OPD: 9AM-1PM", speciality: ["general", "cancer", "heart_disease", "kidney_disease"] },

  // HIMACHAL PRADESH
  { id: "h052", name: "IGMC Shimla (Indira Gandhi Medical College)", city: "Shimla", state: "Himachal Pradesh", lat: 31.1065, lng: 77.1824, phone: "0177-2804251", timings: "24×7 Emergency | OPD: 9AM-2PM", speciality: ["general", "trauma", "cancer", "maternity"] },

  // UTTARAKHAND
  { id: "h053", name: "All India Institute of Medical Sciences (AIIMS) Rishikesh", city: "Rishikesh", state: "Uttarakhand", lat: 30.1290, lng: 78.2903, phone: "0135-2462900", timings: "24×7 Emergency | OPD: 9AM-1PM", speciality: ["general", "cancer", "heart_disease", "kidney_disease", "trauma"] },
  { id: "h054", name: "Government Doon Medical College Dehradun", city: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322, phone: "0135-2659527", timings: "24×7 Emergency", speciality: ["general", "trauma", "maternity"] },

  // CHHATTISGARH
  { id: "h055", name: "AIIMS Raipur", city: "Raipur", state: "Chhattisgarh", lat: 21.2020, lng: 81.6296, phone: "0771-2573660", timings: "24×7 Emergency | OPD: 9AM-1PM", speciality: ["general", "cancer", "heart_disease", "trauma", "kidney_disease"] },
];

module.exports = hospitals;
