import React, {useState} from 'react'
import {ethers, Wallet} from 'ethers'

export const Features = (props) => {
 
//Contract Address
const contractAddress = "0x8c4e1387ca10623c456bfa746b66410c0bbd1308"; 

const abi =[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "Inbox",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getData",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "ins_name",
				"type": "string"
			}
		],
		"name": "setData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
] 

	// deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
	// let contractAddress = '0x84735dFae9B8005011B85cb7799CEC5FFd715726';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

 
	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [getContract, setContract] = useState(null);
	let [getTxLink,setTxLink] =  useState(null);
 	let [getVal,setVal] =  useState(null);
	// Connect to wallet 
	const connectWalletHandler = () => {
		if (window.ethereum) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}
   // important to update account if we have, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers()
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}
	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);
	window.ethereum.on('chainChanged', chainChangedHandler);


	const updateEthers = () => {
		// Calling Net 
		  let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		 //let tempProvider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/bc36b26163404dd9b04cbab040d972ff");
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner); 

		let tempContract = new ethers.Contract(contractAddress, abi, signer);
		setContract(tempContract);
	
	}


	 
	const getBalances = async ()=>{
		const balance = await signer.getBalance();
		console.log("Your balance is : " ,balance.toString());
	}  
	// Start to call my contract method with  get input value 
	const deploySetData = async ()=>{ 
	 const contracts= new ethers.Contract(contractAddress, abi, signer);
     await contracts.setData(getVal).then((tx)=>{
		console.log(tx);
		let acutualTx = tx.hash;
		setTxLink("https://rinkeby.etherscan.io/tx/".concat(acutualTx))
  }); 
  
 
	
	}
 
	
	const handleInput = event => {
		setVal(event.target.value);
	 };
	
 
	return (
		<div>
		<h4> {"Get/Set Contract interaction"} </h4>
			{/* Run to link wallet with web page  */}
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div>
				<h3>Address: {defaultAccount}</h3>
				<br></br> 
			</div>
			 
			{errorMessage} 
			<div>
				{/* take value from user wordes  */}
				<input  
				  onChange={handleInput}
				  type="text"
				  placeholder="Write Your Link "
				 />
				 {/* Send transaction */}
				 <button onClick={deploySetData} >Send Transaction</button>
				<br/>
				<br/>
				<h5 className='text-danger'>
					
					<a href={getTxLink}>Check Details</a>
				</h5>
			</div>
   
		</div>
		 
	);
 
  
}
