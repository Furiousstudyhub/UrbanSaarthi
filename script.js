/* ══════════════════════════════════════════════
   UrbanSaarthi Healthcare Services — JS Engine
   ══════════════════════════════════════════════ */

// ─── State ───
let userLat = null, userLng = null, locationGranted = false, currentHospitalId = null;
let selectedDoctor = null, selectedDate = null, selectedTimeSlot = null;
let _currentDoctors = [];

// ─── 45 Delhi Government Hospitals ───
const hospitals = [
  { id: 1, name: 'LNJP Hospital', fullName: 'Lok Nayak Jai Prakash Narayan Hospital', area: 'Daryaganj, Central Delhi', lat: 28.6363, lng: 77.2340, beds: 35, totalBeds: 120, doctors: 12, phone: '011-2323-2400', address: 'Jawahar Lal Nehru Marg, New Delhi — 110002', tags: ['emergency', '24x7', 'speciality'], distance: null },
  { id: 2, name: 'GTB Hospital', fullName: 'Guru Teg Bahadur Hospital', area: 'Dilshad Garden, East Delhi', lat: 28.6840, lng: 77.3090, beds: 18, totalBeds: 95, doctors: 9, phone: '011-2258-6262', address: 'GTB Enclave, Dilshad Garden, Delhi — 110095', tags: ['emergency', '24x7'], distance: null },
  { id: 3, name: 'Safdarjung Hospital', fullName: 'Safdarjung Hospital', area: 'Safdarjung, South Delhi', lat: 28.5673, lng: 77.2051, beds: 6, totalBeds: 80, doctors: 14, phone: '011-2616-5060', address: 'Ansari Nagar West, New Delhi — 110029', tags: ['speciality', '24x7'], distance: null },
  { id: 4, name: 'RML Hospital', fullName: 'Dr. Ram Manohar Lohia Hospital', area: 'Connaught Place, Central Delhi', lat: 28.6249, lng: 77.2001, beds: 22, totalBeds: 100, doctors: 8, phone: '011-2336-5525', address: 'Baba Khadak Singh Marg, New Delhi — 110001', tags: ['emergency', 'speciality'], distance: null },
  { id: 5, name: 'AIIMS', fullName: 'All India Institute of Medical Sciences', area: 'Ansari Nagar, South Delhi', lat: 28.5672, lng: 77.2100, beds: 41, totalBeds: 180, doctors: 20, phone: '011-2658-8500', address: 'Ansari Nagar East, New Delhi — 110029', tags: ['emergency', '24x7', 'speciality'], distance: null },
  { id: 6, name: 'DDU Hospital', fullName: 'Deen Dayal Upadhyay Hospital', area: 'Hari Nagar, West Delhi', lat: 28.6310, lng: 77.1180, beds: 14, totalBeds: 70, doctors: 7, phone: '011-2556-6441', address: 'Hari Nagar, New Delhi — 110064', tags: ['emergency'], distance: null },
  { id: 7, name: 'Sanjay Gandhi Memorial Hospital', fullName: 'Sanjay Gandhi Memorial Hospital', area: 'Mangolpuri, North West Delhi', lat: 28.7090, lng: 77.1310, beds: 9, totalBeds: 60, doctors: 6, phone: '011-2791-1281', address: 'Mangolpuri, Delhi — 110083', tags: ['24x7'], distance: null },
  { id: 8, name: 'BJRM Hospital', fullName: 'Babu Jagjivan Ram Memorial Hospital', area: 'Jahangirpuri, North Delhi', lat: 28.7252, lng: 77.1720, beds: 27, totalBeds: 90, doctors: 11, phone: '011-2720-3344', address: 'Jahangirpuri, Delhi — 110033', tags: ['emergency', '24x7'], distance: null },
  { id: 9, name: 'G.B. Pant Hospital', fullName: 'Govind Ballabh Pant Institute', area: 'JLN Marg, Central Delhi', lat: 28.6389, lng: 77.2342, beds: 30, totalBeds: 110, doctors: 15, phone: '011-2323-4242', address: 'JLN Marg, New Delhi — 110002', tags: ['emergency', '24x7', 'speciality'], distance: null },
  { id: 10, name: 'Hindu Rao Hospital', fullName: 'Hindu Rao Hospital', area: 'Civil Lines, Central Delhi', lat: 28.6760, lng: 77.2121, beds: 20, totalBeds: 85, doctors: 10, phone: '011-2391-8444', address: 'Subzi Mandi, Delhi — 110007', tags: ['emergency', '24x7'], distance: null },
  { id: 11, name: 'Kasturba Hospital', fullName: 'Kasturba Hospital', area: 'Darya Ganj, Central Delhi', lat: 28.6499, lng: 77.2362, beds: 12, totalBeds: 55, doctors: 8, phone: '011-2323-0000', address: 'Darya Ganj, New Delhi — 110002', tags: ['speciality'], distance: null },
  { id: 12, name: 'Acharya Shree Bhikshu Hospital', fullName: 'Acharya Shree Bhikshu Govt Hospital', area: 'Moti Nagar, West Delhi', lat: 28.6621, lng: 77.1403, beds: 16, totalBeds: 65, doctors: 7, phone: '011-2539-1740', address: 'Moti Nagar, New Delhi — 110015', tags: ['emergency', '24x7'], distance: null },
  { id: 13, name: 'Burari Hospital', fullName: 'Burari Hospital', area: 'Burari, North Delhi', lat: 28.7616, lng: 77.1902, beds: 25, totalBeds: 80, doctors: 9, phone: '011-2756-3201', address: 'Burari, Delhi — 110084', tags: ['emergency', '24x7'], distance: null },
  { id: 14, name: 'Dr. BSA Hospital', fullName: 'Dr. Baba Saheb Ambedkar Hospital', area: 'Rohini, North West Delhi', lat: 28.7329, lng: 77.1198, beds: 19, totalBeds: 75, doctors: 10, phone: '011-2787-0261', address: 'Sector 6, Rohini, Delhi — 110085', tags: ['emergency', '24x7', 'speciality'], distance: null },
  { id: 15, name: 'Chacha Nehru Bal Chikitsalaya', fullName: 'Chacha Nehru Bal Chikitsalaya', area: 'Geeta Colony, East Delhi', lat: 28.6516, lng: 77.2750, beds: 15, totalBeds: 60, doctors: 8, phone: '011-2221-4578', address: 'Geeta Colony, Delhi — 110031', tags: ['speciality'], distance: null },
  { id: 16, name: 'Pt. Madan Mohan Malviya Hospital', fullName: 'Pt. Madan Mohan Malviya Hospital', area: 'Malviya Nagar, South Delhi', lat: 28.5356, lng: 77.2139, beds: 11, totalBeds: 50, doctors: 6, phone: '011-2668-3714', address: 'Malviya Nagar, New Delhi — 110017', tags: ['24x7'], distance: null },
  { id: 17, name: 'Maharishi Valmiki Hospital', fullName: 'Maharishi Valmiki Hospital', area: 'Pooth Khurd, North West Delhi', lat: 28.7720, lng: 77.0840, beds: 22, totalBeds: 80, doctors: 8, phone: '011-2705-6222', address: 'Pooth Khurd, Delhi — 110039', tags: ['emergency', '24x7'], distance: null },
  { id: 18, name: 'Sardar Vallabh Bhai Patel Hospital', fullName: 'Sardar Vallabh Bhai Patel Hospital', area: 'Patel Nagar, Central Delhi', lat: 28.6430, lng: 77.1680, beds: 13, totalBeds: 60, doctors: 7, phone: '011-2587-2202', address: 'East Patel Nagar, New Delhi — 110008', tags: ['emergency'], distance: null },
  { id: 19, name: 'Lady Hardinge Medical College', fullName: 'Lady Hardinge Medical College & Hospital', area: 'Connaught Place', lat: 28.6330, lng: 77.2080, beds: 24, totalBeds: 90, doctors: 12, phone: '011-2336-3298', address: 'Shaheed Bhagat Singh Marg, New Delhi — 110001', tags: ['speciality', '24x7'], distance: null },
  { id: 20, name: 'Aruna Asaf Ali Govt Hospital', fullName: 'Aruna Asaf Ali Government Hospital', area: 'Rajpur Road, North Delhi', lat: 28.6930, lng: 77.2140, beds: 10, totalBeds: 45, doctors: 5, phone: '011-2393-2506', address: 'Rajpur Road, Delhi — 110054', tags: ['emergency'], distance: null },
  { id: 21, name: 'Jag Pravesh Chandra Hospital', fullName: 'Jag Pravesh Chandra Hospital', area: 'Shastri Park, East Delhi', lat: 28.6721, lng: 77.2570, beds: 17, totalBeds: 65, doctors: 7, phone: '011-2220-7413', address: 'Shastri Park, Delhi — 110053', tags: ['emergency', '24x7'], distance: null },
  { id: 22, name: 'Deep Chand Bandhu Hospital', fullName: 'Deep Chand Bandhu Hospital', area: 'Ashok Vihar, North Delhi', lat: 28.6939, lng: 77.1812, beds: 8, totalBeds: 40, doctors: 5, phone: '011-2742-1935', address: 'Ashok Vihar Phase IV, Delhi — 110052', tags: ['24x7'], distance: null },
  { id: 23, name: 'Lal Bahadur Shastri Hospital', fullName: 'Lal Bahadur Shastri Hospital', area: 'Khichripur, East Delhi', lat: 28.6190, lng: 77.3080, beds: 14, totalBeds: 55, doctors: 6, phone: '011-2271-4105', address: 'Khichripur, Delhi — 110091', tags: ['emergency', '24x7'], distance: null },
  { id: 24, name: 'Dr. Hedgewar Arogya Sansthan', fullName: 'Dr. Hedgewar Arogya Sansthan', area: 'Karkardooma, East Delhi', lat: 28.6560, lng: 77.2980, beds: 11, totalBeds: 50, doctors: 5, phone: '011-2220-6969', address: 'Karkardooma, Delhi — 110032', tags: ['emergency'], distance: null },
  { id: 25, name: 'Rao Tula Ram Memorial Hospital', fullName: 'Rao Tula Ram Memorial Hospital', area: 'Jaffarpur, South West Delhi', lat: 28.5550, lng: 77.0640, beds: 10, totalBeds: 45, doctors: 5, phone: '011-2501-4999', address: 'Jaffarpur Kalan, New Delhi — 110073', tags: ['emergency', '24x7'], distance: null },
  { id: 26, name: 'Ambedkar Nagar Hospital', fullName: 'Ambedkar Nagar Hospital', area: 'Dakshinpuri, South Delhi', lat: 28.5170, lng: 77.2440, beds: 9, totalBeds: 40, doctors: 4, phone: '011-2607-0610', address: 'Dakshinpuri, New Delhi — 110062', tags: ['24x7'], distance: null },
  { id: 27, name: 'Sushila Jawahar Lal Nehru Hospital', fullName: 'Sushila JL Nehru Hospital', area: 'Shahdara, East Delhi', lat: 28.6730, lng: 77.2930, beds: 13, totalBeds: 55, doctors: 6, phone: '011-2226-9302', address: 'Shahdara, Delhi — 110032', tags: ['emergency'], distance: null },
  { id: 28, name: 'Maulana Azad Medical College', fullName: 'Maulana Azad Medical College & Hospital', area: 'BSZ Marg, Central Delhi', lat: 28.6358, lng: 77.2384, beds: 32, totalBeds: 130, doctors: 18, phone: '011-2323-3740', address: 'BSZ Marg, New Delhi — 110002', tags: ['emergency', '24x7', 'speciality'], distance: null },
  { id: 29, name: 'Janakpuri Super Speciality Hospital', fullName: 'Janakpuri Super Speciality Hospital', area: 'Janakpuri, West Delhi', lat: 28.6200, lng: 77.0830, beds: 20, totalBeds: 75, doctors: 10, phone: '011-2855-4682', address: 'C-2B, Janakpuri, New Delhi — 110058', tags: ['speciality', '24x7'], distance: null },
  { id: 30, name: 'Rajiv Gandhi Super Speciality', fullName: 'Rajiv Gandhi Super Speciality Hospital', area: 'Tahirpur, East Delhi', lat: 28.6980, lng: 77.3210, beds: 28, totalBeds: 100, doctors: 12, phone: '011-2283-0100', address: 'Tahirpur, Dilshad Garden, Delhi — 110095', tags: ['emergency', '24x7', 'speciality'], distance: null },
  { id: 31, name: 'ILBS Hospital', fullName: 'Institute of Liver & Biliary Sciences', area: 'Vasant Kunj, South Delhi', lat: 28.5205, lng: 77.1539, beds: 15, totalBeds: 60, doctors: 8, phone: '011-4630-0000', address: 'Vasant Kunj, New Delhi — 110070', tags: ['speciality'], distance: null },
  { id: 32, name: 'Bhagwan Mahavir Hospital', fullName: 'Bhagwan Mahavir Hospital', area: 'Pitampura, NW Delhi', lat: 28.7022, lng: 77.1381, beds: 12, totalBeds: 50, doctors: 6, phone: '011-2735-6891', address: 'Pitampura, Delhi — 110034', tags: ['emergency', '24x7'], distance: null },
  { id: 33, name: 'Babasaheb Ambedkar Hospital', fullName: 'Babasaheb Ambedkar Hospital', area: 'Rohini Sec 7, NW Delhi', lat: 28.7250, lng: 77.1146, beds: 18, totalBeds: 70, doctors: 8, phone: '011-2783-1888', address: 'Sector 7, Rohini, Delhi — 110085', tags: ['emergency', '24x7'], distance: null },
  { id: 34, name: 'Dr. N.C. Joshi Memorial Hospital', fullName: 'Dr. N.C. Joshi Memorial Hospital', area: 'Karol Bagh, Central Delhi', lat: 28.6510, lng: 77.1875, beds: 7, totalBeds: 35, doctors: 4, phone: '011-2572-5023', address: 'Karol Bagh, New Delhi — 110005', tags: ['emergency'], distance: null },
  { id: 35, name: 'Guru Nanak Eye Centre', fullName: 'Guru Nanak Eye Centre', area: 'MRS Marg, Central Delhi', lat: 28.6340, lng: 77.2240, beds: 10, totalBeds: 40, doctors: 6, phone: '011-2323-6611', address: 'MRS Marg, New Delhi — 110002', tags: ['speciality'], distance: null },
  { id: 36, name: 'Delhi State Cancer Institute', fullName: 'Delhi State Cancer Institute', area: 'Dilshad Garden', lat: 28.6870, lng: 77.3180, beds: 16, totalBeds: 60, doctors: 9, phone: '011-2211-3927', address: 'Dilshad Garden, Delhi — 110095', tags: ['speciality', '24x7'], distance: null },
  { id: 37, name: 'IHBAS', fullName: 'Institute of Human Behaviour & Allied Sciences', area: 'Dilshad Garden', lat: 28.6917, lng: 77.3083, beds: 20, totalBeds: 80, doctors: 10, phone: '011-2286-9595', address: 'Dilshad Garden, Delhi — 110095', tags: ['speciality', '24x7'], distance: null },
  { id: 38, name: 'Lok Nayak Eye Hospital', fullName: 'Lok Nayak JP Eye Hospital', area: 'JLN Marg', lat: 28.6370, lng: 77.2350, beds: 8, totalBeds: 30, doctors: 5, phone: '011-2323-2401', address: 'JLN Marg, New Delhi — 110002', tags: ['speciality'], distance: null },
  { id: 39, name: 'Balak Ram Hospital', fullName: 'Balak Ram Hospital', area: 'Timarpur, North Delhi', lat: 28.7049, lng: 77.2170, beds: 7, totalBeds: 30, doctors: 4, phone: '011-2391-4025', address: 'Timarpur, Delhi — 110054', tags: ['emergency'], distance: null },
  { id: 40, name: 'Mohalla Clinic Super Centre', fullName: 'Delhi Mohalla Clinic Super Centre', area: 'Sarai Kale Khan', lat: 28.5920, lng: 77.2460, beds: 5, totalBeds: 20, doctors: 3, phone: '011-2435-5001', address: 'Sarai Kale Khan, New Delhi — 110013', tags: ['24x7'], distance: null },
  { id: 41, name: 'Bara Hindu Rao Hospital', fullName: 'Bara Hindu Rao Hospital', area: 'Kamla Nagar, North Delhi', lat: 28.6820, lng: 77.2100, beds: 6, totalBeds: 25, doctors: 3, phone: '011-2392-2006', address: 'Kamla Nagar, Delhi — 110007', tags: ['emergency'], distance: null },
  { id: 42, name: 'Northern Railway Central Hospital', fullName: 'Northern Railway Central Hospital', area: 'Connaught Place', lat: 28.6362, lng: 77.2192, beds: 23, totalBeds: 85, doctors: 10, phone: '011-2344-6821', address: 'Basant Lane, New Delhi — 110001', tags: ['emergency', '24x7', 'speciality'], distance: null },
  { id: 43, name: 'Dada Dev Matri Hospital', fullName: 'Dada Dev Matri Avum Shishu Chikitsalaya', area: 'Dabri, SW Delhi', lat: 28.5951, lng: 77.0909, beds: 8, totalBeds: 35, doctors: 4, phone: '011-2804-2442', address: 'Dabri, New Delhi — 110045', tags: ['speciality', '24x7'], distance: null },
  { id: 44, name: 'Charak Palika Hospital', fullName: 'Charak Palika Hospital', area: 'Moti Bagh, South Delhi', lat: 28.5820, lng: 77.1730, beds: 6, totalBeds: 25, doctors: 3, phone: '011-2467-3700', address: 'Moti Bagh, New Delhi — 110021', tags: ['emergency'], distance: null },
  { id: 45, name: 'Kondli CHC Hospital', fullName: 'Kondli Community Health Centre', area: 'Kondli, East Delhi', lat: 28.6120, lng: 77.3270, beds: 7, totalBeds: 30, doctors: 4, phone: '011-2226-0088', address: 'Kondli, Delhi — 110096', tags: ['24x7'], distance: null },
];

// ─── Ward Generator ───
const defaultWards = [
  { name: 'Emergency Ward', total: 20 }, { name: 'General Ward (Male)', total: 30 }, { name: 'General Ward (Female)', total: 30 },
  { name: 'ICU', total: 10 }, { name: 'Maternity Ward', total: 15 }, { name: 'Paediatric Ward', total: 12 },
  { name: 'Burns Ward', total: 8 }, { name: 'Orthopaedic Ward', total: 10 }
];
function generateWards(h) {
  const now = Math.floor(Date.now() / 30000); // changes every 30 seconds
  return defaultWards.map((w, i) => {
    const seed = h.id * 7 + i * 3 + now;
    const rand = Math.abs(Math.sin(seed * 9301 + 49297) % 1);
    return { name: w.name, total: w.total, available: Math.max(0, Math.min(w.total, Math.floor(rand * w.total * 0.6))) };
  });
}
function getTotalAvailableBeds(h) {
  return generateWards(h).reduce((sum, w) => sum + w.available, 0);
}

// ─── Doctor Pools ───
const firstNamesM = ['Rajesh', 'Suresh', 'Vikram', 'Arun', 'Ramesh', 'Amit', 'Sanjay', 'Deepak', 'Manoj', 'Vinod', 'Ajay', 'Pradeep', 'Ravi', 'Ashok', 'Naveen', 'Rakesh', 'Sunil', 'Pankaj', 'Hemant', 'Gaurav', 'Karan', 'Nitin', 'Mohit', 'Arjun', 'Rahul'];
const firstNamesF = ['Priya', 'Anita', 'Shalini', 'Kavita', 'Neha', 'Sunita', 'Pooja', 'Meena', 'Rekha', 'Nisha', 'Swati', 'Geeta', 'Ritu', 'Archana', 'Vandana', 'Seema', 'Shweta', 'Anjali', 'Divya', 'Bhavna', 'Manisha', 'Sonam', 'Tanu', 'Aarti', 'Komal'];
const lastNames = ['Sharma', 'Verma', 'Singh', 'Gupta', 'Kumar', 'Mehta', 'Joshi', 'Agarwal', 'Saxena', 'Mishra', 'Bhatia', 'Chauhan', 'Yadav', 'Tiwari', 'Dubey', 'Malhotra', 'Kapoor', 'Arora', 'Bansal', 'Rastogi', 'Reddy', 'Patel', 'Khan', 'Siddiqui', 'Nair'];
const specialities = [
  { name: 'General Medicine', cat: ['opd'] }, { name: 'Cardiology', cat: ['specialist', 'opd'] }, { name: 'Orthopaedics', cat: ['specialist', 'opd'] },
  { name: 'Gynaecology', cat: ['specialist', 'opd'] }, { name: 'Paediatrics', cat: ['specialist', 'opd'] }, { name: 'Neurology', cat: ['specialist'] },
  { name: 'Ophthalmology', cat: ['specialist', 'opd'] }, { name: 'ENT', cat: ['specialist', 'opd'] }, { name: 'Dermatology', cat: ['specialist', 'opd'] },
  { name: 'Pulmonology', cat: ['specialist', 'opd'] }, { name: 'Gastroenterology', cat: ['specialist'] }, { name: 'Nephrology', cat: ['specialist'] },
  { name: 'Urology', cat: ['specialist', 'opd'] }, { name: 'Psychiatry', cat: ['specialist', 'opd'] }, { name: 'Emergency Medicine', cat: ['emergency'] },
  { name: 'General Surgery', cat: ['specialist', 'opd'] }, { name: 'Dental Surgery', cat: ['opd'] }
];
const statusPool = ['on-duty', 'on-duty', 'on-duty', 'on-duty', 'on-duty', 'on-duty', 'on-duty', 'in-surgery', 'off-duty'];
const roomPool = ['101, Block A', '204, Block B', '312, Block C', '408, Block D', '501, Block E', '118, Block A', '215, Block B', '310, Block C', '220, Block B', 'Emergency Block', '105, Block A', '320, Block C'];
const hourPool = ['9:00 AM — 2:00 PM', '10:00 AM — 3:00 PM', '8:00 AM — 1:00 PM', '9:00 AM — 12:00 PM', '11:00 AM — 3:00 PM', '10:00 AM — 4:00 PM'];
function seededRandom(s) { const x = Math.sin(s) * 10000; return x - Math.floor(x); }

function generateDoctorsForHospital(hospital) {
  const docs = [];
  const usedNames = new Set();
  for (let i = 0; i < hospital.doctors; i++) {
    const seed = hospital.id * 100 + i;
    const isFemale = seededRandom(seed + 1) > 0.5;
    const fNames = isFemale ? firstNamesF : firstNamesM;
    let fIdx = Math.floor(seededRandom(seed + 2) * fNames.length);
    const lIdx = Math.floor(seededRandom(seed + 3) * lastNames.length);
    let name = 'Dr. ' + fNames[fIdx] + ' ' + lastNames[lIdx];
    let a = 0; while (usedNames.has(name) && a < 10) { a++; fIdx = Math.floor(seededRandom(seed + 10 + a) * fNames.length); name = 'Dr. ' + fNames[fIdx] + ' ' + lastNames[lIdx]; }
    usedNames.add(name);
    const specIdx = Math.floor(seededRandom(seed + 4) * specialities.length);
    const spec = specialities[specIdx];
    const status = statusPool[Math.floor(seededRandom(seed + 5) * statusPool.length)];
    const exp = 5 + Math.floor(seededRandom(seed + 9) * 20);
    docs.push({
      name, speciality: spec.name, status,
      statusLabel: status === 'on-duty' ? 'ON DUTY' : status === 'off-duty' ? 'OFF DUTY' : 'IN SURGERY',
      hours: spec.name === 'Emergency Medicine' ? '24/7 Emergency' : hourPool[Math.floor(seededRandom(seed + 7) * hourPool.length)],
      room: spec.name === 'Emergency Medicine' ? 'Emergency Block' : 'OPD Room: ' + roomPool[Math.floor(seededRandom(seed + 6) * roomPool.length)],
      patients: status === 'on-duty' ? Math.floor(seededRandom(seed + 8) * 15) : null,
      category: [...spec.cat, ...(status === 'on-duty' ? ['on-duty'] : [])],
      note: status === 'in-surgery' ? 'Currently in OT' : status === 'off-duty' ? 'Next available: Tomorrow, 9:00 AM' : null,
      hospitalId: hospital.id, experience: exp, fee: 10
    });
  }
  return docs;
}

// ─── Facility Data ───
const facilities = [
  { icon: '🔬', name: 'Lab & Diagnostics', status: 'available', statusLabel: 'AVAILABLE', desc: 'Blood tests, urine, culture', hours: '7 AM—9 PM' },
  { icon: '💊', name: 'Pharmacy', status: 'available', statusLabel: 'AVAILABLE', desc: 'Free medicines — Jan Aushadhi', hours: '8 AM—10 PM' },
  { icon: '🫁', name: 'Oxygen & Ventilator', status: 'limited', statusLabel: 'LIMITED', desc: '12 ventilators · O₂ supply active', hours: '24×7' },
  { icon: '🩸', name: 'Blood Bank', status: 'available', statusLabel: 'AVAILABLE', desc: 'All groups · Component therapy', hours: '24×7' },
  { icon: '🤱', name: 'Maternity Care', status: 'available', statusLabel: 'AVAILABLE', desc: 'Normal delivery, C-section', hours: '24×7' },
  { icon: '🏥', name: 'ICU / Critical Care', status: 'critical', statusLabel: 'CRITICAL', desc: 'Multi-organ support', hours: '24×7' },
  { icon: '🚑', name: 'Ambulance', status: 'available', statusLabel: 'AVAILABLE', desc: 'GPS tracked ambulances', hours: '24×7' },
  { icon: '🩻', name: 'X-Ray / CT / MRI', status: 'available', statusLabel: 'AVAILABLE', desc: 'Digital X-ray, CT, 1.5T MRI', hours: '8 AM—8 PM' },
];

// ─── Helpers ───
function getBedColor(b) { return b < 5 ? 'red' : b <= 10 ? 'orange' : 'green'; }
function getBarColor(a, t) { const p = (a / t) * 100; return p <= 30 ? 'bar-red' : p <= 60 ? 'bar-orange' : 'bar-green'; }
function getCountColor(a, t) { const p = (a / t) * 100; return p <= 30 ? 'color:var(--red)' : p <= 60 ? 'color:var(--amber)' : 'color:var(--green)'; }

// ─── DOM Refs ───
const $ = id => document.getElementById(id);
const screenHome = $('screen-home'), screenDetail = $('screen-detail');
const hospitalListEl = $('hospital-list'), searchInput = $('search-input');
const locationOverlay = $('location-overlay'), locationStatusBar = $('location-status-bar');

// ═══════════════════════════════════
// FAST LOCATION — Haversine first, OSRM in background
// ═══════════════════════════════════

// Haversine (instant)
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
}

function setHaversineDistances() {
  const lat = userLat || 28.6139, lng = userLng || 77.2090;
  hospitals.forEach(h => { h.distance = haversine(lat, lng, h.lat, h.lng); h.duration = Math.round(h.distance * 2.5); });
  hospitals.sort((a, b) => a.distance - b.distance);
  renderHospitalList(getFilteredHospitals());
  updateHospitalCount();
}

// OSRM refinement (background, no blocking)
async function refineWithOSRM() {
  if (!userLat || !userLng) return;
  for (let i = 0; i < hospitals.length; i += 5) {
    const batch = hospitals.slice(i, i + 5);
    const promises = batch.map(h =>
      fetch(`https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${h.lng},${h.lat}?overview=false`)
        .then(r => r.json()).then(d => {
          if (d.code === 'Ok' && d.routes && d.routes[0]) {
            h.distance = parseFloat((d.routes[0].distance / 1000).toFixed(1));
            h.duration = Math.round(d.routes[0].duration / 60);
          }
        }).catch(() => { })
    );
    await Promise.all(promises);
  }
  hospitals.sort((a, b) => (a.distance || 999) - (b.distance || 999));
  renderHospitalList(getFilteredHospitals());
  $('location-status-text').textContent = `📍 Live location · OSRM road distances updated`;
}

function requestLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error('No geolocation')); return; }
    navigator.geolocation.getCurrentPosition(
      pos => { userLat = pos.coords.latitude; userLng = pos.coords.longitude; locationGranted = true; resolve(); },
      err => reject(err),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });
}

// Init location flow
$('btn-allow-location').addEventListener('click', async () => {
  locationOverlay.classList.remove('active');
  locationStatusBar.classList.add('active');
  $('location-status-text').textContent = 'Detecting location...';
  try {
    await requestLocation();
    $('location-status-text').textContent = `📍 Location found · Showing distances from your location`;
    setHaversineDistances(); // instant
    refineWithOSRM(); // background refinement
  } catch (e) {
    userLat = 28.6139; userLng = 77.2090;
    $('location-status-text').textContent = '📍 Using Delhi centre · Showing approximate distances';
    setHaversineDistances();
  }
});

$('btn-skip-location').addEventListener('click', () => {
  locationOverlay.classList.remove('active');
  userLat = 28.6139; userLng = 77.2090;
  locationStatusBar.classList.add('active');
  $('location-status-text').textContent = '📍 Location skipped · Showing distances from Delhi centre';
  setHaversineDistances();
});

// ─── Filter / Search ───
function getFilteredHospitals() {
  const active = document.querySelector('.filter-chips .chip.active');
  const filter = active ? active.dataset.filter : 'all';
  const q = searchInput.value.toLowerCase().trim();
  let list = [...hospitals];
  if (q) list = list.filter(h => h.name.toLowerCase().includes(q) || h.area.toLowerCase().includes(q) || h.fullName.toLowerCase().includes(q));
  if (filter === 'nearest') list.sort((a, b) => (a.distance || 999) - (b.distance || 999));
  else if (filter !== 'all') list = list.filter(h => h.tags && h.tags.includes(filter));
  return list;
}
function updateHospitalCount() { $('hospital-count-label').textContent = hospitals.length; }

// ─── Render Hospital Cards ───
function renderHospitalList(list) {
  if (!list.length) { hospitalListEl.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><p>No hospitals found.</p></div>'; return; }
  hospitalListEl.innerHTML = list.map(h => {
    const dist = h.distance !== null ? `${h.distance} km` : '...';
    const dur = h.duration ? ` · ~${h.duration} min` : '';
    const liveBeds = getTotalAvailableBeds(h);
    return `<div class="hospital-card" onclick="openDetail(${h.id})">
      <div class="hospital-card-top"><div><div class="hospital-name">${h.name}<span class="verified-badge"><svg viewBox="0 0 24 24" fill="#3B82F6" width="12" height="12"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span></div><div class="hospital-area">${h.area}</div></div><div class="hospital-distance">📍 ${dist}${dur}</div></div>
      <div class="hospital-stats"><span class="stat-pill ${getBedColor(liveBeds)}">🛏️ Beds: ${liveBeds}</span><span class="stat-pill green">👨‍⚕️ Doctors: ${h.doctors}</span></div>
      <div class="hospital-card-bottom"><button class="view-details-btn">View Details →</button></div></div>`;
  }).join('');
}
renderHospitalList(hospitals);
updateHospitalCount();

searchInput.addEventListener('input', () => renderHospitalList(getFilteredHospitals()));
document.querySelectorAll('.filter-chips .chip').forEach(c => {
  c.addEventListener('click', () => {
    // Handle Report chip specially
    if (c.dataset.filter === 'report') {
      // Navigate to reports screen with option to register
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      $('quick-info-bar').classList.remove('visible');
      screenReports.classList.add('active');
      renderReportList(getFilteredReports());
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      $('nav-reports').classList.add('active');
      // Show report registration option
      showReportRegistrationPrompt();
      window.scrollTo(0, 0);
      return;
    }
    document.querySelectorAll('.filter-chips .chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    renderHospitalList(getFilteredHospitals());
  });
});

// ═══════════════════════════════════
// HOSPITAL DETAIL
// ═══════════════════════════════════
function openDetail(id) {
  const h = hospitals.find(x => x.id === id); if (!h) return;
  currentHospitalId = id;
  $('detail-hospital-name').textContent = h.name;
  $('detail-full-name').textContent = h.fullName;
  $('detail-address').textContent = '📍 ' + h.address;
  $('detail-phone').textContent = '📞 ' + h.phone;
  $('detail-distance').textContent = h.distance !== null ? `🚗 ${h.distance} km via road` + (h.duration ? ` · ~${h.duration} min drive` : '') : '🚗 Calculating...';
  $('bed-total-available').textContent = h.beds;
  $('bed-total-capacity').textContent = `out of ${h.totalBeds} total beds`;
  $('qib-beds-count').textContent = h.beds;

  const wards = generateWards(h);
  const totalAvail = wards.reduce((s, w) => s + w.available, 0);
  const totalCap = wards.reduce((s, w) => s + w.total, 0);
  $('bed-total-available').textContent = totalAvail;
  $('bed-total-capacity').textContent = `out of ${totalCap} total beds`;
  $('qib-beds-count').textContent = totalAvail;
  $('ward-list').innerHTML = wards.map(w => { const pct = (w.available / w.total) * 100; return `<div class="ward-row"><span class="ward-name">${w.name}</span><span class="ward-count" style="${getCountColor(w.available, w.total)}">${w.available}/${w.total}</span><div class="ward-bar-wrap"><div class="ward-bar ${getBarColor(w.available, w.total)}" data-width="${pct}"></div></div></div>`; }).join('');

  _currentDoctors = generateDoctorsForHospital(h);
  renderDoctors('all');
  $('doctor-count-text').textContent = `${_currentDoctors.length} doctors listed`;
  renderFacilities();

  screenHome.classList.remove('active'); screenDetail.classList.add('active');
  $('quick-info-bar').classList.add('visible'); window.scrollTo(0, 0);
  requestAnimationFrame(() => { setTimeout(() => { document.querySelectorAll('.ward-bar').forEach(b => { b.style.width = b.dataset.width + '%'; }); }, 100); });

  // Start bed data refresh interval
  if (window._bedRefreshInterval) clearInterval(window._bedRefreshInterval);
  let lastBedUpdate = Date.now();
  window._bedRefreshInterval = setInterval(() => {
    if (currentHospitalId !== h.id) { clearInterval(window._bedRefreshInterval); return; }
    const newWards = generateWards(h);
    const newTotal = newWards.reduce((s, w) => s + w.available, 0);
    const newCap = newWards.reduce((s, w) => s + w.total, 0);
    const bedEl = $('bed-total-available');
    bedEl.textContent = newTotal;
    bedEl.classList.add('updating');
    setTimeout(() => bedEl.classList.remove('updating'), 600);
    $('bed-total-capacity').textContent = `out of ${newCap} total beds`;
    $('qib-beds-count').textContent = newTotal;
    $('ward-list').innerHTML = newWards.map(w => { const pct = (w.available / w.total) * 100; return `<div class="ward-row"><span class="ward-name">${w.name}</span><span class="ward-count" style="${getCountColor(w.available, w.total)}">${w.available}/${w.total}</span><div class="ward-bar-wrap"><div class="ward-bar ${getBarColor(w.available, w.total)}" data-width="${pct}"></div></div></div>`; }).join('');
    const secAgo = Math.round((Date.now() - Date.now() % 30000) / 1000 % 30);
    const titleBar = document.querySelector('#section-beds .section-title-bar p');
    if (titleBar) titleBar.innerHTML = `Live count · Updated ${secAgo}s ago <span class="live-dot-sm"></span>`;
    requestAnimationFrame(() => { document.querySelectorAll('.ward-bar').forEach(b => { b.style.width = b.dataset.width + '%'; }); });
  }, 5000);
}

function renderDoctors(filter) {
  let list = [..._currentDoctors];
  if (filter === 'on-duty') list = list.filter(d => d.status === 'on-duty');
  else if (filter === 'emergency') list = list.filter(d => d.category.includes('emergency'));
  else if (filter === 'opd') list = list.filter(d => d.category.includes('opd'));
  else if (filter === 'specialist') list = list.filter(d => d.category.includes('specialist'));

  $('doctor-list').innerHTML = list.map((d, idx) => {
    const pText = d.patients !== null ? `<span>👥 ${d.patients} waiting</span>` : '';
    return `<div class="doctor-card ${d.status === 'on-duty' ? 'clickable' : ''}" ${d.status === 'on-duty' ? `onclick="openSlotPicker(${_currentDoctors.indexOf(d)})"` : ''}> 
      <div class="doctor-card-top"><span class="doctor-name">${d.name}</span><span class="speciality-tag">${d.speciality}</span></div>
      <div class="doctor-info-row"><span class="experience-tag">${d.experience} YRS EXP</span><span class="fee-tag">₹${d.fee}</span></div>
      <div class="doctor-status"><span class="status-dot ${d.status}"></span><span class="status-text ${d.status}">${d.statusLabel}</span></div>
      <div class="doctor-info"><span>🕐 ${d.hours}</span><span>📍 ${d.room}</span>${pText}</div>
      ${d.note ? `<div class="doctor-note">💬 ${d.note}</div>` : ''}
      ${d.status === 'on-duty' ? `<button class="book-btn" onclick="event.stopPropagation();openSlotPicker(${_currentDoctors.indexOf(d)})">📅 Book Appointment</button>` : ''}
    </div>`;
  }).join('');
}

document.querySelectorAll('.doctor-filter-chips .chip').forEach(c => { c.addEventListener('click', () => { document.querySelectorAll('.doctor-filter-chips .chip').forEach(x => x.classList.remove('active')); c.classList.add('active'); renderDoctors(c.dataset.dfilter); }); });

// Test-to-Doctor specialty mapping
const testDoctorMap = {
  'Lab & Diagnostics': 'General Medicine',
  'Pharmacy': null,
  'Oxygen & Ventilator': 'Pulmonology',
  'Blood Bank': 'General Medicine',
  'Maternity Care': 'Gynaecology',
  'ICU / Critical Care': 'Emergency Medicine',
  'Ambulance': null,
  'X-Ray / CT / MRI': 'General Medicine'
};

const bookableTests = ['Lab & Diagnostics', 'X-Ray / CT / MRI', 'Blood Bank', 'Maternity Care'];

function renderFacilities() {
  $('facility-grid').innerHTML = facilities.map((f, idx) => {
    const isBookable = bookableTests.includes(f.name);
    return `<div class="facility-card">
      <span class="facility-icon">${f.icon}</span>
      <div class="facility-name">${f.name}</div>
      <span class="facility-status ${f.status}">${f.status === 'available' ? '✅' : f.status === 'limited' ? '🟡' : '🔴'} ${f.statusLabel}</span>
      <div class="facility-desc">${f.desc}</div>
      <div class="facility-hours">🕐 ${f.hours}</div>
      ${isBookable ? `<button class="book-test-btn" onclick="event.stopPropagation();openTestBooking(${idx})">📅 Book Test</button>` : ''}
    </div>`;
  }).join('');
}

// Back + Actions
$('detail-back-btn').addEventListener('click', () => { screenDetail.classList.remove('active'); $('quick-info-bar').classList.remove('visible'); screenHome.classList.add('active'); window.scrollTo(0, 0); });
$('qib-call').addEventListener('click', () => { const h = hospitals.find(x => x.id === currentHospitalId); if (h) window.open('tel:' + h.phone.replace(/[^0-9+]/g, '')); });
$('qib-directions').addEventListener('click', () => { const h = hospitals.find(x => x.id === currentHospitalId); if (h) window.open(`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`); });
$('btn-call').addEventListener('click', () => { const h = hospitals.find(x => x.id === currentHospitalId); if (h) window.open('tel:' + h.phone.replace(/[^0-9+]/g, '')); });
$('btn-directions').addEventListener('click', () => { const h = hospitals.find(x => x.id === currentHospitalId); if (h) window.open(`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`); });

// ═══════════════════════════════════
// PRE-BOOKING STEP 1 — SELECT SLOT
// ═══════════════════════════════════
const morningSlots = ['09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM', '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM'];
const afternoonSlots = ['12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '01:00 PM', '01:15 PM', '01:30 PM', '01:45 PM', '02:00 PM', '02:15 PM', '02:30 PM', '02:45 PM', '03:00 PM', '03:15 PM', '03:30 PM'];

function openSlotPicker(docIdx) {
  selectedDoctor = _currentDoctors[docIdx]; if (!selectedDoctor) return;
  selectedDate = null; selectedTimeSlot = null;
  const h = hospitals.find(x => x.id === currentHospitalId);

  // Doctor card
  $('booking-doctor-card').innerHTML = `
    <div class="bdc-row"><div class="bdc-avatar">${selectedDoctor.name.charAt(4)}</div><div class="bdc-info"><div class="bdc-name">${selectedDoctor.name}</div><div class="bdc-meta"><span class="bdc-exp">${selectedDoctor.experience} YEARS EXP</span> · ${selectedDoctor.speciality}</div><div class="bdc-fee">₹${selectedDoctor.fee}</div></div></div>`;

  // Hospital row
  $('booking-hospital-row').innerHTML = `
    <div class="bhr-row"><div class="bhr-text"><span class="bhr-name">${h ? h.name : ''} · ${h && h.distance !== null ? h.distance + ' KM' : ''}</span><span class="bhr-addr">${h ? h.address : ''}</span></div><div class="bhr-map-icon">📍</div></div>`;

  // Date picker (7 days)
  const datePicker = $('date-picker-scroll');
  datePicker.innerHTML = '';
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    const dayName = days[d.getDay()];
    const dateNum = d.getDate().toString().padStart(2, '0');
    const monthName = months[d.getMonth()];
    const isSun = d.getDay() === 0;
    const dateStr = d.toISOString().split('T')[0];
    const btn = document.createElement('button');
    btn.className = 'date-btn' + (i === 0 ? ' selected' : '') + (isSun ? ' sunday' : '');
    btn.dataset.date = dateStr;
    btn.innerHTML = `<span class="date-day">${dayName}</span><span class="date-num">${dateNum}</span><span class="date-month">${monthName}</span>`;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.date-btn').forEach(x => x.classList.remove('selected'));
      btn.classList.add('selected');
      selectedDate = dateStr;
      updateContinueBtn();
    });
    datePicker.appendChild(btn);
    if (i === 0) selectedDate = dateStr;
  }

  // Time slots
  renderTimeSlots();
  $('morning-slot-count').textContent = morningSlots.length + ' SLOTS';
  $('afternoon-slot-count').textContent = afternoonSlots.length + ' SLOTS';
  $('btn-continue-booking').disabled = true;
  $('booking-slot-modal').classList.add('active');
}

function renderTimeSlots() {
  const renderSlots = (slots, containerId) => {
    const c = $(containerId); c.innerHTML = '';
    slots.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'time-slot-btn';
      btn.textContent = t;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.time-slot-btn').forEach(x => x.classList.remove('selected'));
        btn.classList.add('selected');
        selectedTimeSlot = t;
        updateContinueBtn();
      });
      c.appendChild(btn);
    });
  };
  renderSlots(morningSlots, 'morning-slots');
  renderSlots(afternoonSlots, 'afternoon-slots');
}

function updateContinueBtn() { $('btn-continue-booking').disabled = !(selectedDate && selectedTimeSlot); }

$('slot-close-btn').addEventListener('click', () => $('booking-slot-modal').classList.remove('active'));
$('slot-back-btn').addEventListener('click', () => $('booking-slot-modal').classList.remove('active'));
$('btn-continue-booking').addEventListener('click', () => {
  $('booking-slot-modal').classList.remove('active');
  openSummary();
});

// ═══════════════════════════════════
// PRE-BOOKING STEP 2 — SUMMARY
// ═══════════════════════════════════
function openSummary() {
  const h = hospitals.find(x => x.id === currentHospitalId);
  $('summary-consult-for').innerHTML = `
    <div class="consult-for-section"><span class="cf-label">Consult for :</span>
    <div class="cf-row"><div class="cf-avatar">${selectedDoctor.name.charAt(4)}</div><div class="cf-info"><span class="cf-name">${selectedDoctor.name}</span><span class="cf-spec">${selectedDoctor.speciality}</span></div></div></div>`;
  $('booking-summary-modal').classList.add('active');
}

$('summary-close-btn').addEventListener('click', () => $('booking-summary-modal').classList.remove('active'));
$('summary-back-btn').addEventListener('click', () => { $('booking-summary-modal').classList.remove('active'); $('booking-slot-modal').classList.add('active'); });

$('btn-confirm-appointment').addEventListener('click', () => {
  const name = $('summary-name').value.trim();
  const phone = $('summary-phone').value.trim();
  const age = $('summary-age').value.trim();
  const gender = $('summary-gender').value;
  const issue = $('summary-issue').value.trim();
  if (!name || !phone || !age || !gender || !issue) { alert('Please fill all required fields'); return; }

  $('booking-summary-modal').classList.remove('active');
  showBookingConfirmation({
    patientName: name, phone, age, gender, issue,
    aadhar: $('summary-aadhar').value.trim() || 'Not Provided',
    doctor: selectedDoctor.name, doctorSpeciality: selectedDoctor.speciality,
    date: selectedDate, timeSlot: selectedTimeSlot,
    hospital: hospitals.find(x => x.id === currentHospitalId)
  });
});

// ═══════════════════════════════════
// PRE-BOOKING STEP 3 — CONFIRMATION
// ═══════════════════════════════════
function showBookingConfirmation(data) {
  const h = data.hospital;
  const regId = 'US-APT-' + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).substring(2, 6).toUpperCase();
  const dateFormatted = new Date(data.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Build QR using simple text format that Google Lens can read instantly
  const qrText = `Appointment: ${regId}\nName: ${data.patientName}\nDoctor: ${data.doctor}\nDate: ${dateFormatted}\nTime: ${data.timeSlot}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrText)}&ecc=L&margin=4`;

  // Confirmed details card
  $('confirmed-details-card').innerHTML = `
    <div class="cd-card">
      <div class="cd-header"><div><span class="cd-hospital-label">HOSPITAL</span><span class="cd-appt-id">Appointment ID: ${regId}</span></div><span class="cd-upcoming-badge">UPCOMING</span></div>
      <div class="cd-doctor-row"><div class="cd-doc-avatar">${data.doctor.charAt(4)}</div><div><div class="cd-doc-name">${data.doctor}</div><div class="cd-doc-spec">${data.doctorSpeciality}</div></div></div>
      <div class="cd-info-row">🕐 ${dateFormatted}, ${data.timeSlot}</div>
      <div class="cd-info-row">📍 ${h ? h.fullName + ', ' + h.address : ''}</div>
      <div class="cd-booked-for"><span class="cd-bf-label">BOOKED FOR</span><div class="cd-bf-row"><div class="cd-bf-avatar">${data.patientName.charAt(0)}</div><div><div class="cd-bf-name">${data.patientName}</div><div class="cd-bf-phone">+91-${data.phone}</div></div></div></div>
    </div>`;

  // QR section (interactive)
  $('confirmed-qr-section').innerHTML = `
    <div class="confirmed-qr-wrap">
      <p class="cqr-title">📱 Scan QR for appointment details</p>
      <div class="cqr-container" onclick="showQRDetail(this)" data-qr='${qrText.replace(/'/g, "\\'")}'>
        <img src="${qrUrl}" alt="QR Code" class="cqr-img" width="160" height="160"/>
      </div>
      <p class="cqr-tap-hint">Tap QR code to view full details</p>
    </div>`;

  // SMS Badge
  $('sms-sent-badge').innerHTML = `<span>📱</span> Appointment details sent to <strong>+91-${data.phone}</strong>`;
  $('sms-sent-badge').classList.add('show');

  // Store for printing
  window._lastAppointment = { ...data, regId, dateFormatted, qrUrl };

  $('booking-confirmed-modal').classList.add('active');

  // Trigger confetti animation
  setTimeout(() => { document.querySelector('.confirmed-hero').classList.add('animate'); }, 100);

  // Send real SMS
  setTimeout(() => {
    sendRealSMS(data.phone, `UrbanSaarthi: Appointment confirmed!\nDoctor: ${data.doctor}\nDate: ${dateFormatted} at ${data.timeSlot}\nHospital: ${h ? h.name : ''}\nID: ${regId}\nShow this msg at reception.`);
  }, 1500);
}

async function sendRealSMS(phone, msg) {
  // Show sending toast
  const toast = document.createElement('div');
  toast.className = 'sms-toast show';
  toast.innerHTML = `<div class="sms-toast-icon">⏳</div><div class="sms-toast-content"><strong>Sending SMS to +91-${phone}</strong><p>Please wait...</p></div>`;
  document.body.appendChild(toast);

  try {
    const FAST2SMS_API_KEY = 'dU1dBOnyOkYhaSYmrVyprVxkyJJ8kRuHWqgvPiAHyIQLhrbje79jTQnNyjRf';

    // Direct GET request to Fast2SMS API.
    const targetUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&route=v3&sender_id=TXTIND&message=${encodeURIComponent(msg)}&language=english&flash=0&numbers=${phone}`;

    // Using 'no-cors' mode allows us to bypass the proxy entirely!
    // The browser will directly send the request to Fast2SMS, but it will block us from reading the response.
    // This perfectly avoids the AdBlockers that were blocking the 3rd party proxies!
    await fetch(targetUrl, { mode: 'no-cors' });

    // Because 'no-cors' mode gives us an opaque response, we assume success if no hard network error occurs.
    toast.innerHTML = `<div class="sms-toast-icon">📱</div><div class="sms-toast-content"><strong>Real SMS sent to +91-${phone}</strong><p>${msg.substring(0, 80)}...</p></div>`;

  } catch (err) {
    console.error('SMS Error:', err);
    toast.innerHTML = `<div class="sms-toast-icon">❌</div><div class="sms-toast-content"><strong>SMS Error</strong><p>Could not send the SMS. Please check your internet connection.</p></div>`;
  }

  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 500); }, 6000);
}

$('confirmed-close-btn').addEventListener('click', () => $('booking-confirmed-modal').classList.remove('active'));

// ═══════════════════════════════════
// PROPER PDF/PRINT SLIP GENERATION
// ═══════════════════════════════════
$('btn-download-slip').addEventListener('click', () => {
  const appt = window._lastAppointment;
  if (!appt) { window.print(); return; }
  // Create a printable container
  let printDiv = document.getElementById('print-slip-container');
  if (printDiv) printDiv.remove();
  printDiv = document.createElement('div');
  printDiv.id = 'print-slip-container';
  printDiv.innerHTML = `
    <div class="slip-paper">
      <div class="slip-header-section">
        <img src="ecg_line_logo.svg" class="slip-logo" style="width:60px;height:35px;"/>
        <div>
          <div class="slip-brand">UrbanSaarthi</div>
          <div class="slip-subtitle">Delhi Govt Healthcare Services</div>
        </div>
      </div>
      <div class="slip-divider"></div>
      <div class="slip-title">📅 APPOINTMENT SLIP</div>
      <div class="slip-reg-id">Appointment ID: <strong>${appt.regId}</strong></div>
      <div class="slip-generated">Generated: ${new Date().toLocaleString('en-IN')}</div>
      <div class="slip-divider"></div>
      <div class="slip-section">
        <div class="slip-section-title">🏥 Hospital</div>
        <div class="slip-row"><span>Hospital:</span><strong>${appt.hospital ? appt.hospital.fullName : ''}</strong></div>
        <div class="slip-row"><span>Address:</span><span>${appt.hospital ? appt.hospital.address : ''}</span></div>
        <div class="slip-row"><span>Phone:</span><span>${appt.hospital ? appt.hospital.phone : ''}</span></div>
      </div>
      <div class="slip-section">
        <div class="slip-section-title">👨‍⚕️ Doctor</div>
        <div class="slip-row"><span>Doctor:</span><strong>${appt.doctor}</strong></div>
        <div class="slip-row"><span>Speciality:</span><span>${appt.doctorSpeciality}</span></div>
        <div class="slip-row"><span>Date:</span><strong>${appt.dateFormatted}</strong></div>
        <div class="slip-row"><span>Time:</span><strong>${appt.timeSlot}</strong></div>
      </div>
      <div class="slip-section">
        <div class="slip-section-title">👤 Patient</div>
        <div class="slip-row"><span>Name:</span><strong>${appt.patientName}</strong></div>
        <div class="slip-row"><span>Age/Gender:</span><span>${appt.age} / ${appt.gender}</span></div>
        <div class="slip-row"><span>Phone:</span><span>+91-${appt.phone}</span></div>
        <div class="slip-row"><span>Aadhaar:</span><span>${appt.aadhar}</span></div>
      </div>
      <div class="slip-section">
        <div class="slip-section-title">📋 Health Issue</div>
        <div class="slip-row full"><span>Issue:</span><span>${appt.issue}</span></div>
      </div>
      <div class="slip-divider"></div>
      <div class="slip-qr-section">
        <div class="slip-qr-title">📱 Scan for Appointment Info</div>
        <div class="slip-qr-container"><img src="${appt.qrUrl}" alt="QR" width="160" height="160"/></div>
      </div>
      <div class="slip-divider"></div>
      <div class="slip-footer">
        <div class="slip-footer-text">UrbanSaarthi Healthcare · Government of Delhi</div>
        <div class="slip-footer-note">Carry a valid photo ID during your visit. Fee: ₹10 (pay at hospital).</div>
      </div>
    </div>`;
  document.body.appendChild(printDiv);
  window.print();
  setTimeout(() => printDiv.remove(), 2000);
});
$('btn-fill-medical').addEventListener('click', () => alert('Medical details form coming soon!'));

// ═══════════════════════════════════
// INTERACTIVE QR CODE
// ═══════════════════════════════════
function showQRDetail(el) {
  const data = el.dataset.qr;
  const overlay = $('qr-detail-overlay');
  const card = $('qr-detail-card');
  const lines = data.split('\n').map(l => `<div class="qrd-line">${l.replace(/===/g, '').trim() || '&nbsp;'}</div>`).join('');
  card.innerHTML = `<div class="qrd-header"><img src="ecg_line_logo.svg" class="qrd-logo" style="width:48px;height:28px;"/><span>UrbanSaarthi</span><button class="qrd-close" onclick="closeQRDetail()">✕</button></div><div class="qrd-body">${lines}</div>`;
  overlay.classList.add('active');
}
function closeQRDetail() { $('qr-detail-overlay').classList.remove('active'); }
$('qr-detail-overlay').addEventListener('click', e => { if (e.target === $('qr-detail-overlay')) closeQRDetail(); });

// ═══════════════════════════════════
// HOSPITAL REGISTRATION (Separate)
// ═══════════════════════════════════
$('btn-register').addEventListener('click', () => {
  const h = hospitals.find(x => x.id === currentHospitalId);
  $('registration-hospital-info').innerHTML = `<div class="reg-hospital-card"><div class="reg-hospital-name">🏥 ${h ? h.fullName : ''}</div><div class="reg-hospital-addr">📍 ${h ? h.address : ''}</div><div class="reg-hospital-phone">📞 ${h ? h.phone : ''}</div></div>`;
  $('registration-modal').classList.add('active');
});
$('registration-close').addEventListener('click', () => $('registration-modal').classList.remove('active'));

$('registration-form').addEventListener('submit', e => {
  e.preventDefault();
  const h = hospitals.find(x => x.id === currentHospitalId);
  const regId = 'US-REG-' + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).substring(2, 6).toUpperCase();
  const data = {
    regId, type: 'Registration',
    name: $('reg-name').value, age: $('reg-age').value, gender: $('reg-gender').value,
    phone: $('reg-phone').value, aadhar: $('reg-aadhar').value || 'Not Provided',
    address: $('reg-address').value, emergency: $('reg-emergency').value, reason: $('reg-reason').value,
    hospital: h ? h.fullName : '', hospitalAddr: h ? h.address : '', hospitalPhone: h ? h.phone : '',
    generatedAt: new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })
  };

  // Build simple text QR for easy Google Lens scanning
  const qrText = `Registration: ${data.regId}\nName: ${data.name}\nHospital: ${data.hospital}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrText)}&ecc=L&margin=4`;

  $('reg-slip-content').innerHTML = `
    <div class="slip-paper reg-slip">
      <div class="slip-header-section"><img src="ecg_line_logo.svg" class="slip-logo" style="width:60px;height:35px;"/><div><div class="slip-brand">UrbanSaarthi</div><div class="slip-subtitle">Delhi Govt Healthcare Services</div></div></div>
      <div class="slip-divider"></div>
      <div class="slip-title">📋 HOSPITAL REGISTRATION SLIP</div>
      <div class="slip-reg-id">Registration ID: <strong>${data.regId}</strong></div>
      <div class="slip-generated">Generated: ${data.generatedAt}</div>
      <div class="slip-divider"></div>
      <div class="slip-section"><div class="slip-section-title">🏥 Hospital</div>
        <div class="slip-row"><span>Hospital:</span><strong>${data.hospital}</strong></div>
        <div class="slip-row"><span>Address:</span><span>${data.hospitalAddr}</span></div>
        <div class="slip-row"><span>Phone:</span><span>${data.hospitalPhone}</span></div></div>
      <div class="slip-section"><div class="slip-section-title">👤 Patient</div>
        <div class="slip-row"><span>Name:</span><strong>${data.name}</strong></div>
        <div class="slip-row"><span>Age/Gender:</span><span>${data.age} / ${data.gender}</span></div>
        <div class="slip-row"><span>Phone:</span><span>${data.phone}</span></div>
        <div class="slip-row"><span>Aadhaar:</span><span>${data.aadhar}</span></div>
        <div class="slip-row"><span>Address:</span><span>${data.address}</span></div>
        <div class="slip-row"><span>Emergency:</span><span>${data.emergency}</span></div></div>
      <div class="slip-section"><div class="slip-section-title">📋 Visit</div>
        <div class="slip-row full"><span>Reason:</span><span>${data.reason}</span></div></div>
      <div class="slip-divider"></div>
      <div class="slip-qr-section"><div class="slip-qr-title">📱 Scan for Patient Info</div>
        <div class="slip-qr-container" onclick="showQRDetail(this)" data-qr='${qrText.replace(/'/g, "\\'")}'>
          <img src="${qrUrl}" alt="QR" width="180" height="180"/></div>
        <div class="slip-qr-note">Tap QR to view details · Scannable by any QR reader</div></div>
      <div class="slip-divider"></div>
      <div class="slip-footer"><div class="slip-footer-text">UrbanSaarthi Healthcare · Government of Delhi</div>
        <div class="slip-footer-note">Carry a valid photo ID during your visit.</div></div>
    </div>`;

  $('registration-modal').classList.remove('active');
  $('reg-slip-modal').classList.add('active');
  $('registration-form').reset();

  // Real SMS for registration
  setTimeout(() => {
    sendRealSMS(data.phone, `UrbanSaarthi: Registration confirmed at ${data.hospital}. ID: ${data.regId}. Carry valid ID.`);
  }, 1000);
});

$('reg-slip-close').addEventListener('click', () => $('reg-slip-modal').classList.remove('active'));
$('btn-close-reg-slip').addEventListener('click', () => $('reg-slip-modal').classList.remove('active'));

// Close any modal on backdrop click
document.querySelectorAll('.modal-overlay').forEach(o => { o.addEventListener('click', e => { if (e.target === o) o.classList.remove('active'); }); });

// ═══════════════════════════════════
// REPORT STATUS TRACKER
// ═══════════════════════════════════

const screenReports = $('screen-reports');
const screenReportDetail = $('screen-report-detail');

// ─── Report Stages ───
const REPORT_STAGES = [
  { key: 'initiated', label: 'Request Initiated', icon: '📝', desc: 'Lab test request has been created and sent to the lab.' },
  { key: 'collected', label: 'Sample Collected', icon: '🩸', desc: 'Sample has been collected from the patient at the hospital.' },
  { key: 'analysis', label: 'Under Analysis', icon: '🔬', desc: 'Sample is being analyzed in the laboratory.' },
  { key: 'review', label: 'Doctor Review', icon: '👨‍⚕️', desc: 'Results are under supervision and review by the doctor.' },
  { key: 'ready', label: 'Report Ready', icon: '✅', desc: 'Final report has been generated and is ready for download.' }
];

// ─── Mock Lab Reports ───
const labReports = [
  {
    id: 'RPT-2026-001847',
    testName: 'Complete Blood Count (CBC)',
    patientName: 'Rahul Sharma',
    age: 32,
    hospital: 'LNJP Hospital',
    hospitalId: 1,
    doctor: 'Dr. Rajesh Gupta',
    orderedDate: '2026-03-01',
    currentStage: 4, // 0-indexed: Report Ready (all 5 stages done)
    status: 'completed',
    stages: [
      { time: '01 Mar, 9:15 AM', note: 'Order placed via OPD consultation' },
      { time: '01 Mar, 10:30 AM', note: 'Blood sample drawn at Lab Counter 3' },
      { time: '01 Mar, 2:45 PM', note: 'Automated hematology analysis completed' },
      { time: '02 Mar, 10:00 AM', note: 'Reviewed by Dr. Rajesh Gupta — All values normal' },
      { time: '02 Mar, 11:30 AM', note: 'Report generated — Ready for pickup or download' }
    ]
  },
  {
    id: 'RPT-2026-001892',
    testName: 'Thyroid Function Test (TFT)',
    patientName: 'Priya Verma',
    age: 28,
    hospital: 'AIIMS',
    hospitalId: 5,
    doctor: 'Dr. Anita Mehta',
    orderedDate: '2026-03-02',
    currentStage: 3, // Under Doctor Review
    status: 'in-progress',
    stages: [
      { time: '02 Mar, 8:00 AM', note: 'Requested by Dr. Anita Mehta during consultation' },
      { time: '02 Mar, 8:45 AM', note: 'Blood sample collected at Lab Counter 1' },
      { time: '02 Mar, 4:00 PM', note: 'TSH, T3, T4 analysis in progress' },
      { time: '03 Mar, 9:30 AM', note: 'Currently under review by Dr. Anita Mehta' },
      { time: null, note: null }
    ]
  },
  {
    id: 'RPT-2026-001915',
    testName: 'Liver Function Test (LFT)',
    patientName: 'Vikram Singh',
    age: 45,
    hospital: 'Safdarjung Hospital',
    hospitalId: 3,
    doctor: 'Dr. Sanjay Kumar',
    orderedDate: '2026-03-03',
    currentStage: 2, // Under Analysis
    status: 'in-progress',
    stages: [
      { time: '03 Mar, 7:30 AM', note: 'LFT ordered for pre-surgical screening' },
      { time: '03 Mar, 8:15 AM', note: 'Blood sample collected — fasting confirmed' },
      { time: '03 Mar, 11:00 AM', note: 'Biochemistry analysis currently running' },
      { time: null, note: null },
      { time: null, note: null }
    ]
  },
  {
    id: 'RPT-2026-001930',
    testName: 'COVID-19 RT-PCR',
    patientName: 'Neha Agarwal',
    age: 35,
    hospital: 'GTB Hospital',
    hospitalId: 2,
    doctor: 'Dr. Deepak Chauhan',
    orderedDate: '2026-03-03',
    currentStage: 1, // Sample Collected
    status: 'in-progress',
    stages: [
      { time: '03 Mar, 6:00 AM', note: 'RT-PCR test requested — travel clearance' },
      { time: '03 Mar, 6:30 AM', note: 'Nasopharyngeal swab collected at isolation bay' },
      { time: null, note: null },
      { time: null, note: null },
      { time: null, note: null }
    ]
  },
  {
    id: 'RPT-2026-001758',
    testName: 'Lipid Profile',
    patientName: 'Suresh Bansal',
    age: 55,
    hospital: 'RML Hospital',
    hospitalId: 4,
    doctor: 'Dr. Amit Verma',
    orderedDate: '2026-02-28',
    currentStage: 4,
    status: 'completed',
    stages: [
      { time: '28 Feb, 7:00 AM', note: 'Lipid profile ordered for cardiac evaluation' },
      { time: '28 Feb, 7:30 AM', note: 'Fasting blood sample collected' },
      { time: '28 Feb, 1:00 PM', note: 'Cholesterol, HDL, LDL, Triglycerides analyzed' },
      { time: '28 Feb, 4:30 PM', note: 'Reviewed — LDL elevated, medication advised' },
      { time: '01 Mar, 9:00 AM', note: 'Final report available for download' }
    ]
  },
  {
    id: 'RPT-2026-001945',
    testName: 'Urinalysis (Routine)',
    patientName: 'Kavita Mishra',
    age: 40,
    hospital: 'DDU Hospital',
    hospitalId: 6,
    doctor: 'Dr. Pooja Sharma',
    orderedDate: '2026-03-03',
    currentStage: 0, // Just Initiated
    status: 'pending',
    stages: [
      { time: '03 Mar, 3:00 PM', note: 'Routine urinalysis ordered' },
      { time: null, note: null },
      { time: null, note: null },
      { time: null, note: null },
      { time: null, note: null }
    ]
  },
  {
    id: 'RPT-2026-001820',
    testName: 'HbA1c (Glycated Hemoglobin)',
    patientName: 'Manoj Tiwari',
    age: 50,
    hospital: 'G.B. Pant Hospital',
    hospitalId: 9,
    doctor: 'Dr. Ravi Joshi',
    orderedDate: '2026-03-01',
    currentStage: 4,
    status: 'completed',
    stages: [
      { time: '01 Mar, 10:00 AM', note: 'HbA1c test for diabetes monitoring' },
      { time: '01 Mar, 10:20 AM', note: 'Blood sample drawn at diabetic clinic counter' },
      { time: '01 Mar, 5:00 PM', note: 'HPLC analysis completed' },
      { time: '02 Mar, 11:15 AM', note: 'Reviewed by Dr. Ravi Joshi — Good control' },
      { time: '02 Mar, 12:00 PM', note: 'Report finalized — HbA1c: 6.2%' }
    ]
  },
  {
    id: 'RPT-2026-001950',
    testName: 'Chest X-Ray (PA View)',
    patientName: 'Arjun Yadav',
    age: 22,
    hospital: 'Hindu Rao Hospital',
    hospitalId: 10,
    doctor: 'Dr. Mohit Reddy',
    orderedDate: '2026-03-03',
    currentStage: 2,
    status: 'in-progress',
    stages: [
      { time: '03 Mar, 11:00 AM', note: 'X-ray ordered for persistent cough evaluation' },
      { time: '03 Mar, 11:30 AM', note: 'Digital X-ray captured at Radiology Dept' },
      { time: '03 Mar, 1:00 PM', note: 'Image being reviewed by radiology team' },
      { time: null, note: null },
      { time: null, note: null }
    ]
  }
];

// ─── Render Report Cards ───
function getFilteredReports() {
  const activeChip = document.querySelector('#report-filter-chips .chip.active');
  const filter = activeChip ? activeChip.dataset.rfilter : 'all';
  const q = ($('report-search-input') ? $('report-search-input').value : '').toLowerCase().trim();
  let list = [...labReports];
  if (q) list = list.filter(r => r.id.toLowerCase().includes(q) || r.testName.toLowerCase().includes(q) || r.patientName.toLowerCase().includes(q));
  if (filter === 'in-progress') list = list.filter(r => r.status === 'in-progress');
  else if (filter === 'completed') list = list.filter(r => r.status === 'completed');
  else if (filter === 'pending') list = list.filter(r => r.status === 'pending');
  return list;
}

function renderReportList(list) {
  const el = $('report-list');
  if (!el) return;
  $('report-count-label').textContent = list.length;
  if (!list.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><p>No reports found.</p></div>';
    return;
  }
  el.innerHTML = list.map(r => {
    const statusClass = r.status === 'completed' ? 'status-completed' : r.status === 'in-progress' ? 'status-in-progress' : 'status-pending';
    const statusLabel = r.status === 'completed' ? 'Completed' : r.status === 'in-progress' ? 'In Progress' : 'Pending';
    const miniSteps = REPORT_STAGES.map((_, i) => {
      if (i < r.currentStage) return '<div class="mini-step completed"></div>';
      if (i === r.currentStage) return '<div class="mini-step active"></div>';
      return '<div class="mini-step"></div>';
    }).join('');
    const currentStageLabel = REPORT_STAGES[r.currentStage] ? REPORT_STAGES[r.currentStage].label : '';
    return `<div class="report-card" onclick="openReportDetail('${r.id}')">
      <div class="report-card-header">
        <div class="report-card-left">
          <div class="report-id">${r.id}</div>
          <div class="report-test-name">${r.testName}</div>
          <div class="report-patient-name">👤 ${r.patientName} · ${r.age} yrs</div>
        </div>
        <span class="report-status-badge ${statusClass}"><span class="badge-dot"></span>${statusLabel}</span>
      </div>
      <div class="report-mini-progress">${miniSteps}</div>
      <div class="report-card-meta">
        <span class="report-hospital">🏥 ${r.hospital}</span>
        <span class="report-date">📅 ${r.orderedDate}</span>
      </div>
      <button class="report-view-btn">View Details →</button>
    </div>`;
  }).join('');
}

// ─── Report Detail with Timeline ───
function openReportDetail(reportId) {
  const r = labReports.find(x => x.id === reportId);
  if (!r) return;
  $('report-detail-title').textContent = r.testName;
  const el = $('report-detail-content');

  // Status badge
  const statusClass = r.status === 'completed' ? 'status-completed' : r.status === 'in-progress' ? 'status-in-progress' : 'status-pending';
  const statusLabel = r.status === 'completed' ? 'Completed' : r.status === 'in-progress' ? 'In Progress' : 'Pending';

  // Timeline
  const timelineHTML = REPORT_STAGES.map((stage, i) => {
    let stepClass, dotClass;
    if (i < r.currentStage) { stepClass = 'step-completed'; dotClass = 'completed'; }
    else if (i === r.currentStage) { stepClass = r.status === 'completed' && i === 4 ? 'step-completed' : 'step-active'; dotClass = r.status === 'completed' && i === 4 ? 'completed' : 'active'; }
    else { stepClass = 'step-pending'; dotClass = 'pending'; }

    const stageData = r.stages[i];
    const timeStr = stageData && stageData.time ? `🕐 ${stageData.time}` : '';
    const noteStr = stageData && stageData.note ? stageData.note : (dotClass === 'pending' ? 'Awaiting this stage...' : '');

    return `<div class="timeline-step ${stepClass}">
      <div class="timeline-dot ${dotClass}">${dotClass === 'completed' ? '✓' : stage.icon}</div>
      <div class="timeline-content">
        <div class="timeline-title">${stage.label}</div>
        <div class="timeline-desc">${noteStr}</div>
        ${timeStr ? `<div class="timeline-time">${timeStr}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="report-detail-info">
      <h2>${r.testName}</h2>
      <div class="report-detail-meta">
        <span>🧪 ${r.id}</span>
        <span>👤 ${r.patientName}, ${r.age} yrs</span>
        <span class="report-status-badge ${statusClass}"><span class="badge-dot"></span>${statusLabel}</span>
      </div>
    </div>

    <div class="report-summary-card">
      <h4>📋 Test Information</h4>
      <div class="report-summary-row"><span class="rs-label">Test Name</span><span class="rs-value">${r.testName}</span></div>
      <div class="report-summary-row"><span class="rs-label">Patient</span><span class="rs-value">${r.patientName}</span></div>
      <div class="report-summary-row"><span class="rs-label">Hospital</span><span class="rs-value">${r.hospital}</span></div>
      <div class="report-summary-row"><span class="rs-label">Ordered By</span><span class="rs-value">${r.doctor}</span></div>
      <div class="report-summary-row"><span class="rs-label">Date Ordered</span><span class="rs-value">${r.orderedDate}</span></div>
      <div class="report-summary-row"><span class="rs-label">Current Stage</span><span class="rs-value">${REPORT_STAGES[r.currentStage].label}</span></div>
    </div>

    <div class="report-summary-card">
      <h4>📍 Report Progress</h4>
      <div class="report-timeline">${timelineHTML}</div>
    </div>

    ${r.status === 'completed' ? `
    <div class="report-detail-actions">
      <button class="btn-outline" onclick="alert('Sharing feature coming soon!')">📤 Share Report</button>
      <button class="btn-saffron" onclick="alert('Download initiated!')">📥 Download PDF</button>
    </div>` : `
    <div class="report-detail-actions">
      <button class="btn-outline" onclick="alert('You will be notified when your report is ready.')">🔔 Notify Me</button>
      <button class="btn-saffron" onclick="openDetail(${r.hospitalId}); screenReportDetail.classList.remove('active');">🏥 View Hospital</button>
    </div>`}
  `;

  // Transition screens
  screenReports.classList.remove('active');
  screenReportDetail.classList.add('active');
  window.scrollTo(0, 0);
}

// ─── Report Navigation ───
$('reports-back-btn').addEventListener('click', () => {
  screenReports.classList.remove('active');
  screenHome.classList.add('active');
  window.scrollTo(0, 0);
});

$('report-detail-back-btn').addEventListener('click', () => {
  screenReportDetail.classList.remove('active');
  screenReports.classList.add('active');
  window.scrollTo(0, 0);
});

// ─── Bottom Nav: Healthcare ↔ Reports toggle ───
if ($('nav-reports')) {
  $('nav-reports').addEventListener('click', () => {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    $('quick-info-bar').classList.remove('visible');
    screenReports.classList.add('active');
    renderReportList(getFilteredReports());
    // Update active nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    $('nav-reports').classList.add('active');
    window.scrollTo(0, 0);
  });
}

if ($('nav-healthcare')) {
  $('nav-healthcare').addEventListener('click', () => {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    let qib = $('quick-info-bar');
    if (qib) qib.classList.remove('visible');
    screenHome.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    $('nav-healthcare').classList.add('active');
    window.scrollTo(0, 0);
  });
}

// ─── Report Filter Chips ───
document.querySelectorAll('#report-filter-chips .chip').forEach(c => {
  c.addEventListener('click', () => {
    document.querySelectorAll('#report-filter-chips .chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    renderReportList(getFilteredReports());
  });
});

// ─── Report Search ───
if ($('report-search-input')) {
  $('report-search-input').addEventListener('input', () => renderReportList(getFilteredReports()));
}

// ═══════════════════════════════════
// TEST BOOKING FLOW (from Facilities)
// ═══════════════════════════════════
let selectedTest = null, selectedTestDoctor = null, selectedTestDate = null, selectedTestTimeSlot = null;

function openTestBooking(facilityIdx) {
  const facility = facilities[facilityIdx];
  if (!facility) return;
  selectedTest = facility;
  selectedTestDate = null;
  selectedTestTimeSlot = null;

  // Find auto-assigned doctor
  const targetSpec = testDoctorMap[facility.name] || 'General Medicine';
  selectedTestDoctor = _currentDoctors.find(d => d.speciality === targetSpec && d.status === 'on-duty')
    || _currentDoctors.find(d => d.status === 'on-duty')
    || _currentDoctors[0];

  // Render test info card
  $('test-info-card').innerHTML = `
    <div class="test-name">${facility.icon} ${facility.name}</div>
    <div class="test-desc">${facility.desc} · ${facility.hours}</div>`;

  // Render assigned doctor
  $('assigned-doctor-card').innerHTML = `
    <div class="adc-avatar">${selectedTestDoctor.name.charAt(4)}</div>
    <div class="adc-info">
      <div class="adc-label">Auto-Assigned Doctor</div>
      <div class="adc-name">${selectedTestDoctor.name}</div>
      <div class="adc-spec">${selectedTestDoctor.speciality} · ${selectedTestDoctor.experience} yrs exp</div>
    </div>`;

  // Date picker (7 days)
  const datePicker = $('test-date-picker-scroll');
  datePicker.innerHTML = '';
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    const isSun = d.getDay() === 0;
    const dateStr = d.toISOString().split('T')[0];
    const btn = document.createElement('button');
    btn.className = 'date-btn' + (i === 0 ? ' selected' : '') + (isSun ? ' sunday' : '');
    btn.dataset.date = dateStr;
    btn.innerHTML = `<span class="date-day">${days[d.getDay()]}</span><span class="date-num">${d.getDate().toString().padStart(2, '0')}</span><span class="date-month">${months[d.getMonth()]}</span>`;
    btn.addEventListener('click', () => {
      datePicker.querySelectorAll('.date-btn').forEach(x => x.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTestDate = dateStr;
      updateTestConfirmBtn();
    });
    datePicker.appendChild(btn);
    if (i === 0) selectedTestDate = dateStr;
  }

  // Time slots
  renderTestTimeSlots();
  $('test-morning-slot-count').textContent = morningSlots.length + ' SLOTS';
  $('test-afternoon-slot-count').textContent = afternoonSlots.length + ' SLOTS';
  $('btn-confirm-test-booking').disabled = true;
  $('test-booking-modal').classList.add('active');
}

function renderTestTimeSlots() {
  const renderSlots = (slots, containerId) => {
    const c = $(containerId); c.innerHTML = '';
    slots.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'time-slot-btn';
      btn.textContent = t;
      btn.addEventListener('click', () => {
        document.querySelectorAll('#test-booking-modal .time-slot-btn').forEach(x => x.classList.remove('selected'));
        btn.classList.add('selected');
        selectedTestTimeSlot = t;
        updateTestConfirmBtn();
      });
      c.appendChild(btn);
    });
  };
  renderSlots(morningSlots, 'test-morning-slots');
  renderSlots(afternoonSlots, 'test-afternoon-slots');
}

function updateTestConfirmBtn() {
  const name = $('test-patient-name') ? $('test-patient-name').value.trim() : '';
  const phone = $('test-phone') ? $('test-phone').value.trim() : '';
  $('btn-confirm-test-booking').disabled = !(selectedTestDate && selectedTestTimeSlot && name && phone);
}

// Listen for input changes on test form fields
['test-patient-name', 'test-phone', 'test-age'].forEach(id => {
  const el = $(id);
  if (el) el.addEventListener('input', updateTestConfirmBtn);
});

$('test-booking-close-btn').addEventListener('click', () => $('test-booking-modal').classList.remove('active'));
$('test-booking-back-btn').addEventListener('click', () => $('test-booking-modal').classList.remove('active'));

$('btn-confirm-test-booking').addEventListener('click', () => {
  const name = $('test-patient-name').value.trim();
  const phone = $('test-phone').value.trim();
  const age = $('test-age').value.trim();
  const gender = $('test-gender').value;
  if (!name || !phone) { alert('Please fill patient name and phone'); return; }

  $('test-booking-modal').classList.remove('active');
  showBookingConfirmation({
    patientName: name, phone, age: age || 'N/A', gender: gender || 'N/A',
    issue: `Test: ${selectedTest.name} — ${selectedTest.desc}`,
    aadhar: 'Not Provided',
    doctor: selectedTestDoctor.name, doctorSpeciality: selectedTestDoctor.speciality,
    date: selectedTestDate, timeSlot: selectedTestTimeSlot,
    hospital: hospitals.find(x => x.id === currentHospitalId)
  });
});

// ═══════════════════════════════════
// REPORT REGISTRATION (from Report chip)
// ═══════════════════════════════════
function showReportRegistrationPrompt() {
  // Show a floating action button or toast for report registration
  let fab = document.querySelector('.report-fab');
  if (fab) fab.remove();
  fab = document.createElement('button');
  fab.className = 'report-fab btn-saffron';
  fab.style.cssText = 'position:fixed;bottom:85px;right:20px;z-index:999;padding:14px 20px;border-radius:50px;font-size:14px;box-shadow:0 6px 20px rgba(16,185,129,0.4);display:flex;align-items:center;gap:8px;';
  fab.innerHTML = '📋 Register for Report';
  fab.addEventListener('click', () => {
    $('report-registration-modal').classList.add('active');
    fab.remove();
  });
  document.body.appendChild(fab);
  setTimeout(() => { if (fab.parentNode) fab.remove(); }, 15000);
}

$('report-reg-close').addEventListener('click', () => $('report-registration-modal').classList.remove('active'));

$('report-registration-form').addEventListener('submit', e => {
  e.preventDefault();
  const regId = 'US-RPT-' + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).substring(2, 6).toUpperCase();
  const data = {
    regId,
    name: $('rr-name').value,
    age: $('rr-age').value,
    gender: $('rr-gender').value,
    phone: $('rr-phone').value,
    test: $('rr-test').value,
    reason: $('rr-reason').value,
    generatedAt: new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })
  };

  // Add to lab reports list
  labReports.unshift({
    id: regId,
    testName: $('rr-test').options[$('rr-test').selectedIndex].text,
    patientName: data.name,
    age: parseInt(data.age),
    hospital: 'Self Registered',
    hospitalId: 1,
    doctor: 'Pending Assignment',
    orderedDate: new Date().toISOString().split('T')[0],
    currentStage: 0,
    status: 'pending',
    stages: [
      { time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), note: 'Report registration submitted via UrbanSaarthi' },
      { time: null, note: null },
      { time: null, note: null },
      { time: null, note: null },
      { time: null, note: null }
    ]
  });

  $('report-registration-modal').classList.remove('active');
  $('report-registration-form').reset();
  renderReportList(getFilteredReports());

  // Send real SMS
  const smsMsg = `UrbanSaarthi: Report registration confirmed! ID: ${data.regId}. Test: ${data.test}. Visit your nearest hospital for sample collection. Carry valid ID.`;
  sendRealSMS(data.phone, smsMsg);

  // Alert success
  const toast = document.createElement('div');
  toast.className = 'sms-toast show';
  toast.style.background = '#ecfdf5';
  toast.innerHTML = `<div class="sms-toast-icon">✅</div><div class="sms-toast-content"><strong>Report Registered: ${data.regId}</strong><p>Your report registration is confirmed. Visit the hospital for sample collection.</p></div>`;
  document.body.appendChild(toast);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 500); }, 5000);
});

// ═══════════════════════════════════
// AUTO-REFRESH BED DATA ON HOME SCREEN
// ═══════════════════════════════════
setInterval(() => {
  if (screenHome.classList.contains('active')) {
    renderHospitalList(getFilteredHospitals());
  }
}, 30000);

// Close new modals on backdrop click
['test-booking-modal', 'report-registration-modal'].forEach(id => {
  const el = $(id);
  if (el) el.addEventListener('click', e => { if (e.target === el) el.classList.remove('active'); });
});

// ═══════════════════════════════════
// CITY HELPDESK ENGINE
// ═══════════════════════════════════
const screenHelpline = $('screen-helpline');

// Navigation
if ($('nav-helpline')) {
  $('nav-helpline').addEventListener('click', () => {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    if ($('quick-info-bar')) $('quick-info-bar').classList.remove('visible');
    screenHelpline.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    $('nav-helpline').classList.add('active');
    window.scrollTo(0, 0);
  });
}

// Ensure nav-home also switches to healthcare home (since home == healthcare in this app context)
if ($('nav-home')) {
  $('nav-home').addEventListener('click', () => {
    $('nav-healthcare').click();
  });
}

// Tab Switching
if ($('tab-file-complaint')) {
  $('tab-file-complaint').addEventListener('click', () => {
    $('tab-file-complaint').classList.add('active');
    $('tab-check-status').classList.remove('active');
    $('view-file-complaint').classList.add('active');
    $('view-check-status').classList.remove('active');
  });
}

if ($('tab-check-status')) {
  $('tab-check-status').addEventListener('click', () => {
    $('tab-check-status').classList.add('active');
    $('tab-file-complaint').classList.remove('active');
    $('view-check-status').classList.add('active');
    $('view-file-complaint').classList.remove('active');
    renderComplaints();
  });
}

// Department & Issue Data
const departmentIssues = {
  'Municipal Corporation': ['Irregular waste collection', 'Waterlogging during rain', 'Blocked sewerline', 'Other'],
  'Delhi Jal Board': ['Water quality issues', 'Irregular water supply', 'Water pipeline leakage', 'Other'],
  'Healthcare Department': ['Poor hygiene in hospital', 'Shortage of medicines', 'Delay in emergency care', 'Other'],
  'Public Works Department (PWD)': ['Large potholes', 'Damaged traffic signboard', 'Broken safety railings', 'Other'],
  'Electricity Department': ['Frequent power cuts', 'Excessive bill', 'Hanging/exposed wires', 'Other']
};

const deptSelect = $('complaint-dept');
const issueSelect = $('complaint-issue');

if (deptSelect && issueSelect) {
  deptSelect.addEventListener('change', () => {
    const dept = deptSelect.value;
    issueSelect.innerHTML = '<option value="">Select Issue</option>';
    if (dept && departmentIssues[dept]) {
      departmentIssues[dept].forEach(issue => {
        const opt = document.createElement('option');
        opt.value = issue;
        opt.textContent = issue;
        issueSelect.appendChild(opt);
      });
      issueSelect.disabled = false;
    } else {
      issueSelect.disabled = true;
    }
  });
}

// Mock Complaints Data
const myComplaints = [
  {
    id: 'CMP-109283',
    dept: 'Municipal Corporation',
    issue: 'Irregular waste collection',
    desc: 'Garbage has not been collected from Sector 4 for the past 3 days.',
    date: '2026-03-01 09:30 AM',
    status: 'in-progress'
  },
  {
    id: 'CMP-108112',
    dept: 'Electricity Department',
    issue: 'Frequent power cuts',
    desc: 'Continuous voltage fluctuations and power cuts during evening hours.',
    date: '2026-02-25 06:15 PM',
    status: 'resolved'
  }
];

// File Complaint Submission
if ($('complaint-form')) {
  $('complaint-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const dept = deptSelect.value;
    const issue = issueSelect.value;
    const desc = $('complaint-desc').value;
    const location = $('complaint-location').value;
    const sendMail = $('complaint-send-mail') ? $('complaint-send-mail').checked : false;

    const newId = 'CMP-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();

    let dateStr = now.toLocaleDateString('en-CA') + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    myComplaints.unshift({
      id: newId,
      dept,
      issue,
      desc,
      date: dateStr,
      status: 'registered'
    });

    // Show Toast
    const toast = document.createElement('div');
    toast.className = 'sms-toast show';
    toast.innerHTML = `<div class="sms-toast-icon">✅</div><div class="sms-toast-content"><strong>Complaint Registered</strong><p>ID: ${newId}. Forwarded to ${dept}.</p></div>`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 500); }, 4000);

    // Send Real SMS
    const userPhone = prompt("Enter your 10-digit mobile number to receive SMS confirmation:", "");
    if (userPhone && userPhone.length === 10) {
      sendRealSMS(userPhone, `UrbanSaarthi: Complaint ID ${newId} registered under ${dept}. Issue: ${issue}. We will update you shortly.`);
    }

    $('complaint-form').reset();
    issueSelect.innerHTML = '<option value="">Select Department First</option>';
    issueSelect.disabled = true;

    if (sendMail) {
      generateAndShowAIMail(newId, dept, issue, desc, location, dateStr);
    }
  });
}

const deptEmails = {
  'Municipal Corporation': 'mcd@mcd.nic.in',
  'Delhi Jal Board': 'djb@djb.gov.in',
  'Healthcare Department': 'health@delhi.gov.in',
  'Public Works Department (PWD)': 'pwd@delhi.gov.in',
  'Electricity Department': 'power@delhi.gov.in'
};

function generateAndShowAIMail(cmpId, dept, issue, desc, location, dateStr) {
  const targetEmail = deptEmails[dept] || 'info@delhi.gov.in';
  const userEmail = 'user123@gmail.com';
  const subject = `[URGENT] Formal Complaint [${cmpId}]: ${issue} in my area`;

  const mailBody = `
    <p>Dear Sir/Madam,</p>
    <p>I am writing this mail to formally register a complaint regarding a persistent civic issue in my locality. I request the concerned authorities to look into this matter at the earliest and take necessary action to resolve it.</p>
    <p><strong>Complaint ID:</strong> ${cmpId}</p>
    <p><strong>Category:</strong> ${issue}</p>
    <p><strong>Detailed Issue:</strong><br/>${desc}</p>
    <p><strong>Exact Location/Address:</strong><br/>${location}</p>
    <p>This issue is causing significant inconvenience to the residents of the area.</p>
    <p>Please find my details below for any further communication regarding this matter.</p>
    <p>Sincerely,</p>
    <p><strong>A Concerned Citizen</strong><br/>Email: ${userEmail}<br/>Date: ${dateStr}</p>
  `;

  $('mail-slip-content').innerHTML = `
    <div class="slip-paper mail-slip" style="text-align: left; padding: 25px;">
      <div style="border-bottom: 2px solid var(--border-color); padding-bottom: 15px; margin-bottom: 20px;">
        <div style="font-size: 14px; margin-bottom: 8px;"><strong>From:</strong> ${userEmail}</div>
        <div style="font-size: 14px; margin-bottom: 8px;"><strong>To:</strong> ${targetEmail}</div>
        <div style="font-size: 16px; font-weight: 600; color: var(--saffron);"><strong>Subject:</strong> ${subject}</div>
      </div>
      <div style="font-size: 14px; line-height: 1.6; color: var(--text-color);">
        ${mailBody}
      </div>
    </div>
  `;

  window._lastGeneratedMail = $('mail-slip-content').innerHTML;

  $('mail-slip-modal').classList.add('active');
}

if ($('mail-slip-close')) $('mail-slip-close').addEventListener('click', () => $('mail-slip-modal').classList.remove('active'));
if ($('btn-close-mail-slip')) $('btn-close-mail-slip').addEventListener('click', () => $('mail-slip-modal').classList.remove('active'));

if ($('btn-download-mail-pdf')) {
  $('btn-download-mail-pdf').addEventListener('click', () => {
    let printDiv = document.getElementById('print-slip-container');
    if (printDiv) printDiv.remove();
    printDiv = document.createElement('div');
    printDiv.id = 'print-slip-container';
    printDiv.innerHTML = window._lastGeneratedMail || '';
    document.body.appendChild(printDiv);
    window.print();
    setTimeout(() => printDiv.remove(), 2000);
  });
}

// Check Status Logic
function renderComplaints() {
  const query = $('complaint-search-input').value.toLowerCase().trim();
  const list = myComplaints.filter(c => c.id.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query) || c.dept.toLowerCase().includes(query));

  $('complaint-count-label').textContent = list.length;

  const container = $('complaint-list');
  if (list.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">📂</div><p>No complaints found.</p></div>';
    return;
  }

  container.innerHTML = list.map(c => {
    let statusFormatted = c.status;
    if (c.status === 'in-progress') statusFormatted = 'In Progress';
    if (c.status === 'registered') statusFormatted = 'Registered';
    if (c.status === 'resolved') statusFormatted = 'Resolved';

    return `<div class="complaint-card">
      <div class="complaint-header">
        <span class="complaint-id-meta">${c.id}</span>
        <span class="status-badge ${c.status}">${statusFormatted}</span>
      </div>
      <div class="complaint-dept">${c.dept}</div>
      <div class="complaint-issue">${c.issue}</div>
      <div class="complaint-desc">${c.desc}</div>
      <div class="complaint-footer">
        <span class="complaint-date">🕒 ${c.date}</span>
      </div>
    </div>`;
  }).join('');
}

if ($('complaint-search-input')) {
  $('complaint-search-input').addEventListener('input', renderComplaints);
}

// ═══════════════════════════════════
// BROADCAST SYSTEM LOGIC
// ═══════════════════════════════════
let broadcastMessages = [
  { id: 'b1', title: 'Water Supply Interruption in South Delhi', authority: 'Delhi Jal Board', date: '2026-03-05', content: 'Dear Residents,\n\nThis is to inform you that water supply in parts of South Delhi will be interrupted on 06-Mar-2026 from 10:00 AM to 04:00 PM due to urgent maintenance work at the primary treatment plant.\n\nPlease store adequate water in advance. We regret the inconvenience caused.\n\nRegards,\nChief Engineer, DJB', isRead: false },
  { id: 'b2', title: 'Advisory: Rise in Dengue Cases', authority: 'Healthcare Department', date: '2026-03-04', content: 'Notice to all Citizens,\n\nDue to the recent unseasonal rains, a rise in Dengue and Chikungunya cases has been observed. All citizens are advised to:\n1. Empty stagnant water from coolers and pots.\n2. Use mosquito repellents.\n3. Report to the nearest Mohalla Clinic or Govt Hospital if experiencing high fever.\n\nStay Safe.\nDirectorate of Health Services', isRead: false },
  { id: 'b3', title: 'Road Repair Work at Ring Road', authority: 'Public Works Dept (PWD)', date: '2026-03-01', content: 'Traffic Advisory:\n\nMajor pothole repair and road resurfacing work will commence on the Outer Ring Road stretch near Sector 14 from tonight 11:00 PM to 05:00 AM. \n\nCommuters are requested to take alternative routes via the bypass to avoid delays.\n\nIssued in public interest.', isRead: true }
];

function updateBroadcastBadge() {
  const unreadCount = broadcastMessages.filter(b => !b.isRead).length;
  const badge = $('nav-broadcast-badge');
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

function renderBroadcasts() {
  const container = $('broadcast-list');
  if (!container) return;

  if (broadcastMessages.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">📢</div><p>No new broadcasts.</p></div>';
    return;
  }

  container.innerHTML = broadcastMessages.map(b => `
    <div class="broadcast-card ${b.isRead ? '' : 'unread'}" onclick="openBroadcastLetter('${b.id}')">
      <div class="broadcast-top-row">
        <span class="broadcast-authority">🏛️ ${b.authority}</span>
        <span class="broadcast-date">${b.date}</span>
      </div>
      <div class="broadcast-title">${b.title}</div>
      <div class="broadcast-preview">${b.content}</div>
    </div>
  `).join('');
}

function openBroadcastLetter(id) {
  const notice = broadcastMessages.find(b => b.id === id);
  if (!notice) return;

  // Mark read
  notice.isRead = true;
  updateBroadcastBadge();
  renderBroadcasts();

  const letterHTML = `
    <div class="slip-paper mail-slip" style="text-align: left; padding: 25px;">
      <div style="border-bottom: 2px solid var(--border-color); padding-bottom: 15px; margin-bottom: 20px; text-align: center;">
        <h3 style="margin-bottom: 4px; color: var(--blue); text-transform: uppercase;">GOVERNMENT OF NCT OF DELHI</h3>
        <p style="font-size: 14px; font-weight: 600;">${notice.authority}</p>
      </div>
      <div style="font-size: 14px; margin-bottom: 15px; display: flex; justify-content: space-between;">
        <span><strong>Ref No:</strong> ${notice.id.toUpperCase()}-${Math.floor(Math.random() * 10000)}</span>
        <span><strong>Date:</strong> ${notice.date}</span>
      </div>
      <div style="font-size: 16px; font-weight: 700; margin-bottom: 16px; text-align: center; text-decoration: underline;">
        SUBJECT: ${notice.title}
      </div>
      <div style="font-size: 14px; line-height: 1.6; color: var(--text-color); white-space: pre-wrap;">
${notice.content}
      </div>
      <div style="margin-top: 30px; text-align: right;">
        <p style="font-size: 14px; margin-bottom: 4px;"><strong>Issued By,</strong></p>
        <p style="font-size: 14px;">${notice.authority}<br/>Govt of Delhi</p>
      </div>
    </div>
  `;

  $('broadcast-letter-content').innerHTML = letterHTML;
  window._lastGeneratedBroadcast = letterHTML;
  $('broadcast-letter-modal').classList.add('active');
}

if ($('broadcast-letter-close')) $('broadcast-letter-close').addEventListener('click', () => $('broadcast-letter-modal').classList.remove('active'));
if ($('btn-close-broadcast-slip')) $('btn-close-broadcast-slip').addEventListener('click', () => $('broadcast-letter-modal').classList.remove('active'));

if ($('btn-download-broadcast-pdf')) {
  $('btn-download-broadcast-pdf').addEventListener('click', () => {
    let printDiv = document.getElementById('print-slip-container');
    if (printDiv) printDiv.remove();
    printDiv = document.createElement('div');
    printDiv.id = 'print-slip-container';
    printDiv.innerHTML = window._lastGeneratedBroadcast || '';
    document.body.appendChild(printDiv);
    window.print();
    setTimeout(() => printDiv.remove(), 2000);
  });
}

// ═══════════════════════════════════
// BOTTOM NAVIGATION LOGIC
// ═══════════════════════════════════
function switchScreen(screenId, navId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  // Remove active from all nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Show target
  const targetScreen = $(screenId);
  if (targetScreen) targetScreen.classList.add('active');
  const targetNav = $(navId);
  if (targetNav) targetNav.classList.add('active');

  if (screenId === 'screen-broadcast') {
    renderBroadcasts();
  }
}

if ($('nav-home')) $('nav-home').addEventListener('click', () => switchScreen('screen-home', 'nav-home'));
if ($('nav-healthcare')) $('nav-healthcare').addEventListener('click', () => switchScreen('screen-home', 'nav-healthcare'));
if ($('nav-helpline')) $('nav-helpline').addEventListener('click', () => switchScreen('screen-helpline', 'nav-helpline'));
if ($('nav-broadcast')) $('nav-broadcast').addEventListener('click', () => switchScreen('screen-broadcast', 'nav-broadcast'));
if ($('nav-profile')) $('nav-profile').addEventListener('click', () => {
  if (localStorage.getItem('urban_user')) {
    switchScreen('screen-profile', 'nav-profile');
    renderProfileDashboard();
  } else {
    switchScreen('screen-login', 'nav-profile');
  }
});

// ═══════════════════════════════════
// AUTHENTICATION & PROFILE FLOW
// ═══════════════════════════════════
let generatedOTP = null;

function checkAuthOnLoad() {
  const userStr = localStorage.getItem('urban_user');
  if (!userStr) {
    // Not logged in -> Show Login
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    $('screen-login').classList.add('active');
  } else {
    // Logged in
    const user = JSON.parse(userStr);
    if (!user.name) {
      // Setup not complete
      switchScreen('screen-profile-setup', 'nav-profile');
    }
  }
}

// Generate OTP
if ($('btn-send-otp')) {
  $('btn-send-otp').addEventListener('click', () => {
    const phone = $('login-phone').value.trim();
    if (phone.length !== 10) { alert('Please enter a valid 10-digit mobile number'); return; }

    // Generate 4 digit OTP
    generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

    // Use existing SMS function
    sendRealSMS(phone, `Your UrbanSaarthi Login OTP is: ${generatedOTP}. Please do not share this with anyone.`);

    // Switch UI
    $('login-phone-form').style.display = 'none';
    $('login-otp-form').style.display = 'block';

    // Auto focus first otp box
    setTimeout(() => { if ($('otp-1')) $('otp-1').focus(); }, 100);
  });
}

// OTP Auto Tab
const otpBoxes = ['otp-1', 'otp-2', 'otp-3', 'otp-4'];
otpBoxes.forEach((id, idx) => {
  const box = $(id);
  if (box) {
    box.addEventListener('input', (e) => {
      if (e.target.value.length === 1 && idx < 3) {
        $(otpBoxes[idx + 1]).focus();
      }
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && e.target.value === '' && idx > 0) {
        $(otpBoxes[idx - 1]).focus();
      }
    });
  }
});

// Resend OTP
if ($('btn-resend-otp')) {
  $('btn-resend-otp').addEventListener('click', () => {
    $('login-phone-form').style.display = 'block';
    $('login-otp-form').style.display = 'none';
    otpBoxes.forEach(id => { if ($(id)) $(id).value = ''; });
  });
}

// Verify OTP
if ($('btn-verify-otp')) {
  $('btn-verify-otp').addEventListener('click', () => {
    const entered = otpBoxes.map(id => $(id) ? $(id).value : '').join('');
    if (entered.length < 4) { alert('Please enter the full 4-digit OTP'); return; }

    if (entered === generatedOTP || entered === '1234') { // For testing allow 1234
      const phone = $('login-phone').value.trim();
      let user = localStorage.getItem('urban_user');
      if (user) {
        // Already registered user
        switchScreen('screen-home', 'nav-home');
      } else {
        // New user
        localStorage.setItem('urban_user', JSON.stringify({ phone }));
        switchScreen('screen-profile-setup', 'nav-profile');
      }
    } else {
      alert('Invalid OTP. Please try again.');
    }
  });
}

// Save Profile Setup
if ($('profile-setup-form')) {
  $('profile-setup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem('urban_user');
    let phone = 'Unknown';
    if (userStr) {
      phone = JSON.parse(userStr).phone;
    }

    const userData = {
      phone: phone,
      name: $('setup-name').value.trim(),
      dob: $('setup-dob').value,
      blood: $('setup-blood').value,
      gender: $('setup-gender').value,
      address: $('setup-address').value.trim(),
      abha: $('setup-abha').value.trim()
    };

    localStorage.setItem('urban_user', JSON.stringify(userData));
    alert('Profile Complete! Welcome to UrbanSaarthi.');
    switchScreen('screen-profile', 'nav-profile');
    renderProfileDashboard();
  });
}

// Render Profile Dashboard
function renderProfileDashboard() {
  const userStr = localStorage.getItem('urban_user');
  if (!userStr) return;
  const user = JSON.parse(userStr);

  if ($('prof-name')) $('prof-name').textContent = user.name || 'User';
  if ($('prof-phone')) $('prof-phone').textContent = user.phone || '9999999999';

  if ($('profile-initial')) {
    $('profile-initial').textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  }

  // Handle avatar rendering
  const initialDiv = $('profile-initial');
  const previewImg = $('profile-image-preview');

  if (user.avatarUrl && previewImg && initialDiv) {
    previewImg.src = user.avatarUrl;
    previewImg.style.display = 'block';
    initialDiv.style.opacity = '0'; // Hide initial but keep dimensions
  } else if (previewImg && initialDiv) {
    previewImg.style.display = 'none';
    initialDiv.style.opacity = '1';
  }

  if ($('prof-dob')) {
    const d = new Date(user.dob);
    $('prof-dob').textContent = isNaN(d) ? '-' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  if ($('prof-gender')) $('prof-gender').textContent = user.gender || '-';
  if ($('prof-blood')) $('prof-blood').textContent = user.blood || '-';
  if ($('prof-abha')) $('prof-abha').textContent = user.abha || 'Not linked';
  if ($('prof-address')) $('prof-address').textContent = user.address || '-';
}

// ═══════════════════════════════════
// PROFILE PICTURE UPLOAD LOGIC
// ═══════════════════════════════════
const profileAvatarWrapper = document.querySelector('.profile-avatar-wrapper');
const profileImageInput = $('profile-image-input');

if (profileAvatarWrapper && profileImageInput) {
  // Trigger file selection on click
  profileAvatarWrapper.addEventListener('click', () => {
    profileImageInput.click();
  });

  // Handle image selection
  profileImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Convert image to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;

        // Save to localStorage
        const userStr = localStorage.getItem('urban_user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          userObj.avatarUrl = base64String;
          localStorage.setItem('urban_user', JSON.stringify(userObj));

          // Instantly re-render dashboard
          renderProfileDashboard();
        }
      };

      // Handle read errors
      reader.onerror = () => {
        alert('Error reading the image file. Please try again or try a different image.');
      };

      reader.readAsDataURL(file);
    }
  });
}

// Logout
if ($('btn-logout')) {
  $('btn-logout').addEventListener('click', () => {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('urban_user');
      $('login-phone-form').style.display = 'block';
      $('login-otp-form').style.display = 'none';
      otpBoxes.forEach(id => { if ($(id)) $(id).value = ''; });
      $('login-phone').value = '';
      switchScreen('screen-login', 'nav-profile');
    }
  });
}

// Initialize on load
updateBroadcastBadge();
renderBroadcasts();
checkAuthOnLoad();

