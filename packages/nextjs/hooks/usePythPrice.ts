import { useState, useEffect } from 'react';

interface PriceData {
  binary: {
    data: string[];
  };
  parsed: Array<{
    id: string;
    price: {
      price: string;
      conf: string;
      expo: number;
    };
  }>;
}

export const usePythPrice = (amount: number) => {
  const [rlusdAmount, setRlusdAmount] = useState<number>(0);
  const [priceUpdateData, setPriceUpdateData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPrices = async () => {
      if (amount <= 0) return;
      
      setIsLoading(true);
      try {
        console.log('开始获取Pyth价格, HKD金额:', amount);
        const response = await fetch(
          'https://hermes.pyth.network/v2/updates/price/latest?ids[]=0x65652029e7acde632e80192dcaa6ea88e61d84a4c78a982a63e98f4bbcb288d5&ids[]=0x19d75fde7fee50fe67753fdc825e583594eb2f51ae84e114a5246c4ab23aff4c'
        );
        const data: PriceData = await response.json();
        console.log('Pyth API 返回数据:', data);
        
        // 获取 RLUSD 和 HKD 价格
        const rlusdPrice = data.parsed.find(p => 
          p.id === '65652029e7acde632e80192dcaa6ea88e61d84a4c78a982a63e98f4bbcb288d5'
        );
        const hkdPrice = data.parsed.find(p => 
          p.id === '19d75fde7fee50fe67753fdc825e583594eb2f51ae84e114a5246c4ab23aff4c'
        );

        if (rlusdPrice && hkdPrice) {
          // 计算所需的 RLUSD 数量
          const rlusdValue = Number(rlusdPrice.price.price) * Math.pow(10, rlusdPrice.price.expo);
          const hkdValue = Number(hkdPrice.price.price) * Math.pow(10, hkdPrice.price.expo);
          const requiredRlusd = (amount / hkdValue) * rlusdValue;
          
          console.log('价格计算结果:', {
            rlusdValue,
            hkdValue,
            requiredRlusd,
            binary: '0x' + data.binary.data[0]
          });

          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setRlusdAmount(requiredRlusd);
          setPriceUpdateData(data.binary.data);
        }
      } catch (error) {
        console.error('获取 Pyth 价格失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, [amount]);

  return { rlusdAmount, priceUpdateData, isLoading };
}; 