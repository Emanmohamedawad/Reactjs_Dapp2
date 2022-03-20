import { ethers } from 'ethers';
import React, {useState} from 'react';
import Storage_Abi from './Contracts/storage.json'

const Storage = () => {
    let contractAddress = '0xf6F3f86BAeF8d133b038038EbdbDfD02EEd17eaA';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [currentContractVal, setCurrentContractVal] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

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

	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}

	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () =>{
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);
		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress , Storage_Abi , tempSigner);
		setContract(tempContract);
	}

	const setHandler = (event) => {
		event.preventDefault();
		console.log('sending ' + event.target.setText.value + ' to the contract');
		contract.set(event.target.setText.value);
	}

	const getCurrentVal = async () => {
		let val = await contract.get();
		setCurrentContractVal(val);
	}

  return (
    <div className='main'>
        <h4> {"Get/Set Contract interaction by MetaMask"} </h4>
	    <button onClick={connectWalletHandler}>{connButtonText}</button>
		<div>
				<h3>Address: {defaultAccount}</h3>
		</div>
		<form onSubmit={setHandler}>
				<input id="setText" type="text"/>
				<button className='update_btn' type={"submit"}> Request  Contract </button>
			</form>
			<div>
			{/* <h3>Address: {setText.value}</h3> */}
			{/* <button onClick={getCurrentVal} style={{marginTop: '5em'}}> Get Current Contract Value </button> */}
			</div>
			{/* {currentContractVal} */}

		{errorMessage}
    </div>
  );
}

export default Storage;

