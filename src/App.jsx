import './App.css'
import {useState,useEffect} from 'react'
import * as XLSX from 'xlsx';
import {PieChart , Pie,Tooltip, BarChart,XAxis,YAxis,Bar,Legend,CartesianGrid} from 'recharts';

export default function App() {
  
  const [data, setData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [Value , setvalue] = useState(''); 
  const [Name , setname] = useState(''); 
  const [number, setNumber] = useState(50);
  const[loading , setloading] = useState(false);
  const [interval , setinterval] = useState(0);

  const handleFileUpload = (e) => {
    setloading(true);
    console.log("change handler");
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
                  
     // Assuming you want to access the first sheet by its name
    // Use SheetNames instead of Sheets
    const sheetName = workbook.SheetNames[0]; 
    const sheet = workbook.Sheets[sheetName];
    const parseData = XLSX.utils.sheet_to_json(sheet);
    setData(parseData);
                };
    setloading(false);
  }

  console.log(data);



 function valuehandler(e) {
  e.preventDefault();
  setvalue(e.target.value); // Update the 'Value' state with user input
}

function namehandler(e) {
  e.preventDefault();
  setname(e.target.value); // Update the 'Name' state with user input
}


  const toggleChart = () => {
    setShowChart(!showChart);
  };

  // Convert the data into the required format for a pie chart
  const pieChartData = data.map((item) => ({
    // name: Object.keys(item)[0],
    // value: parseFloat(Object.values(item)[item.length]),
    name: item[Name],
  value: parseFloat(item[Value]),
  }));


  useEffect(() => {
    // Update the number value based on pieChartData.length
    if (pieChartData.length > 50) {
      setNumber(800);
      setinterval(2);
    } else if (pieChartData.length < 50) {
      setNumber(250);
      setinterval(0)
    } else if(pieChartData.length > 100){
      setNumber(1200);
      setinterval(5);
    }
    else {
      // Define a default value here if needed
      setNumber(400);
    }
  }, [pieChartData]); // Listen for changes in pieChartData

  const width_length = number/pieChartData.length;
  console.log(pieChartData);
  console.log(pieChartData.length);
  console.log(width_length);
  console.log("Name",Name,"Value",Value);
  
  return (
    <main>

      <div className="export-component">
        <h1>Excel File to Chart</h1>
        <label>
          Upload Excel File
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </label>
      </div>


      {
        data.length >0 && (
          loading ? (<div>Loading</div>):
          (<table>
            <thead>
              <tr>
                {
                  Object.keys(data[0]).map((key)=>(
                    <th key={key}>{key}</th>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              {
                data.map((row,index)=>(
                  <tr key={index}>
                    {
                      Object.values(row).map((value, index)=>(
                        <td key={index}> {value} </td>
                      ))
                    }
                  </tr>
                ))
              }
            </tbody>
          </table>)
        )
      }

      <p className='decs'>Name and value is same as table</p>

      <label className='Name'>
        Name: 
        <input type="text" placeholder="Name" onChange={namehandler} ></input>
      </label>

      <label className='value'>
        Value:
        <input type="text" placeholder="Value" onChange={valuehandler}></input>
      </label>
      
      <button className='toggle' onClick={toggleChart}>Show Chart</button>

      {
        showChart &&
         <div className="chart-container">
          <BarChart
         width={width_length*100}
        height={width_length*60}
        data={pieChartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name"
          angle={-45}
          interval={interval}
          textAnchor="end" // or "middle" depending on your preference
            tick={{
              fill: 'white', // Set the fill color for the tick labels
              fontSize: 10, // Adjust font size as needed
            }}
          />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#007bff" />
      </BarChart>
        </div>
      }
      
    </main>
  )
}
