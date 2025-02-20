"use client";

import { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { usePythPrice } from '../hooks/usePythPrice';
import { useAccount, useReadContract, useBalance } from 'wagmi';

import { useScaffoldWriteContract,  useScaffoldWatchContractEvent } from '~~/hooks/scaffold-eth';
import { formatUnits } from 'viem'

const HomePage = () => {
  const [data, setData] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedResult, setScannedResult] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [hkdAmount, setHkdAmount] = useState<number>(0);
  const { rlusdAmount, priceUpdateData, isLoading } = usePythPrice(hkdAmount);
  const [pythData, setPythData] = useState<string>('');
  const { address: userAddress } = useAccount();
  const [isTransactionComplete, setIsTransactionComplete] = useState(false);

  const { writeContractAsync: submitFundingAsync } = useScaffoldWriteContract({
    contractName: "RLUSDFundPool",
  });

  const rlusdBalance = useBalance({
    address: userAddress,
    token: '0xe101FB315a64cDa9944E570a7bFfaFE60b994b1D',
  });


  const rlusdAllowance = useReadContract({
    address: '0xe101FB315a64cDa9944E570a7bFfaFE60b994b1D',
    abi: [
      {
        type: 'function',
        name: 'allowance',
        stateMutability: 'view',
        inputs: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' }
        ],
        outputs: [{ type: 'uint256' }]
      }
    ],
    functionName: 'allowance',
    args: [userAddress, '0xA296a2453502eE77F5FdD13E77869e505D3cAdaD'],
  });



  const steps = [
    { id: 1, title: 'Scan QR Code', description: scanned ? `Scanned: ${scannedResult}` : 'Get Payment Amount' },
    {
      id: 2,
      title: 'Calculate RLUSD Amount',
      description: currentStep >= 2 ?
        (completedSteps.includes(2) ? `Payment Required: ${rlusdAmount.toFixed(6)} RLUSD` : 'Calculating...')
        : ''
    },
    {
      id: 3,
      title: 'Check Wallet Balance',
      description: rlusdBalance.data ?
        `Current Balance: ${formatUnits(rlusdBalance.data.value, rlusdBalance.data.decimals)} RLUSD` :
        'Fetching Balance...'
    },
    {
      id: 4,
      title: 'Check Allowance',
      description: rlusdAllowance ?
        `Sufficient Allowance` :
        'Checking Allowance...'
    },
    { id: 5, title: 'Initiate Payment', description: currentStep >= 5 ? 'Click Button to Complete Payment' : '' },
    { 
      id: 6, 
      title: 'Confirm Payment', 
      description: isTransactionComplete 
        ? `Paid ${rlusdAmount.toFixed(6)} RLUSD (${hkdAmount.toFixed(2)} HKD)` 
        : currentStep >= 6 
          ? 'Waiting for Transaction Confirmation...' 
          : '' 
    }
  ];

  useEffect(() => {
    if (currentStep === 2 && !isLoading && rlusdAmount > 0) {
      setCompletedSteps(prev => [...prev, 2]);
      setCurrentStep(3);
    }
  }, [currentStep, isLoading, rlusdAmount]);

  useEffect(() => {
    if (currentStep === 3 && rlusdBalance.data) {
      const balance = Number(formatUnits(rlusdBalance.data.value, rlusdBalance.data.decimals));
      console.log('RLUSD Balance:', balance, 'RLUSD');

      // Check if balance is sufficient
      const hasEnoughBalance = balance >= rlusdAmount;
      if (hasEnoughBalance) {
        setCompletedSteps(prev => [...prev, 3]);
        setCurrentStep(4);
      }
    }
  }, [currentStep, rlusdBalance.data, rlusdAmount]);

  useEffect(() => {
    console.log('rlusdAllowance', rlusdAllowance.data);

    if (currentStep === 4 && rlusdAllowance !== undefined) {
      const currentAllowance = Number(rlusdAllowance.data) / 1e18;
      console.log('Allowance:', currentAllowance, 'RLUSD');

      const hasEnoughAllowance = currentAllowance >= rlusdAmount;
      if (hasEnoughAllowance) {
        setCompletedSteps(prev => [...prev, 4]);
        setCurrentStep(5);
      }
    }
  }, [currentStep, rlusdAmount, rlusdAllowance]);

  const handleDecode = async (result: string) => {
    try {
      const amountMatch = result.toLowerCase().match(/(\d+\.?\d*)\s*(hkd)?/);

      if (amountMatch) {
        const amount = parseFloat(amountMatch[1]);
        const currency = amountMatch[2] ? 'HKD' : '';

        console.log(`Detected Amount: ${amount} ${currency}`);
        setScannedResult(`${amount} ${currency}`);
        setData(`${amount} ${currency}`);
        setHkdAmount(amount);
        setScanned(true);
        setCompletedSteps([1]);
        setCurrentStep(2);

        // Wait for Pyth price data
        await new Promise(resolve => setTimeout(resolve, 2000));

      } else {
        console.log('No valid amount detected');
        setScannedResult('No valid amount detected');
        setData('No valid amount detected');
      }
    } catch (error) {
      console.error('Error parsing QR code result:', error);
      setScannedResult('Parse Error');
      setData('Parse Error');
    }
  };

  const handleError = (error: Error) => {
    console.error(error);
    alert('Please allow camera access to scan QR code');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-base-200 to-base-700">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="relative flex-1 flex flex-col items-center">
          <div className="relative z-1 flex-1 w-1/2 min-h-[70vh] border-4 border-base-content/20 rounded-3xl overflow-hidden flex flex-col items-center">
            <div className="w-1/4 aspect-square mt-16">
              <div className="relative w-full h-full">
                <div className={`absolute w-full h-full transition-all duration-500 ${!scanned ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <div className="rounded-2xl overflow-hidden" style={{ opacity: "1", filter: "contrast(1.3) brightness(0.8)" }}>
                    <Scanner
                      onScan={(result) => {
                        if (result && result.length > 0) {
                          handleDecode(result[0].rawValue);
                        }
                      }}
                      onError={(error) => {
                        console.error(error);
                      }}
                      constraints={{ facingMode: 'environment' }}
                    />
                  </div>
                </div>

                <div className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ${scanned ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
                  <div className="rounded-2xl border-2 border-success bg-base-100/20 h-full flex flex-col items-center justify-center space-y-2">
                    <CheckCircleIcon className="w-12 h-12 text-success" />
                    <p className="text-success text-sm font-medium">Scan Complete</p>
                    <p className="text-base-content/80 text-xs">
                      {scannedResult}
                    </p>
                  </div>
                </div>
              </div>
            </div>


            <div className="w-full max-w-md mt-8 px-4">
              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mt-1">
                      {completedSteps.includes(step.id) || (step.id === 6 && isTransactionComplete) ? (
                        <CheckCircleIcon className="w-8 h-8 text-success" />
                      ) : currentStep === step.id && !isTransactionComplete ? (
                        <ArrowPathIcon className="w-8 h-8 text-base-content animate-spin" />
                      ) : (
                        <ClockIcon className="w-8 h-8 text-base-content/30" />
                      )}
                    </div>
                    <div className={`flex-1 flex justify-between items-start ${
                      currentStep === step.id && !isTransactionComplete
                        ? 'text-base-content' 
                        : completedSteps.includes(step.id) || (step.id === 6 && isTransactionComplete)
                          ? 'text-success' 
                          : 'text-base-content/30'
                    }`}>
                      <div>
                        <p className="font-medium">{step.title}</p>
                        <p className="text-sm opacity-80">{step.description}</p>
                      </div>
                      {currentStep === step.id && step.id === 5 && (
                        <button
                          className="btn btn-outline btn-sm rounded-full ml-4 border-2 border-white text-white 
                          hover:bg-white/20 hover:border-white hover:text-white transition-all duration-200"
                          disabled={!priceUpdateData}
                          onClick={async () => {
                            try {
                              await submitFundingAsync({
                                functionName: "submitFunding",
                                args: [
                                  "0x19d75fde7fee50fe67753fdc825e583594eb2f51ae84e114a5246c4ab23aff4c",
                                  BigInt(Math.floor(hkdAmount * 1000)),
                                  priceUpdateData.map(data => `0x${data}`) as readonly `0x${string}`[],
                                ],
                              });
                              setCompletedSteps(prev => [...prev, 5]);
                              setCurrentStep(6);
                              setIsTransactionComplete(true);
                            } catch (e) {
                              console.error("Payment Error:", e);
                            }
                          }}
                        >
                          Confirm Payment
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
