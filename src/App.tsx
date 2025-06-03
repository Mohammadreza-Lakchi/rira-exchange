import { useState } from "react";
import { CiRepeat } from "react-icons/ci";
import { ClipLoader } from "react-spinners";

function App() {
  const [firstCurrency, setFirstCurrency] = useState<string>("irr");
  const [firstCurrencyInString, setFirstCurrencyInString] =
    useState<string>("ریال ایران");
  const [secondCurrency, setSecondCurrency] = useState<string>("usd");
  const [secondCurrencyInString, setSecondCurrencyInString] =
    useState<string>("دلار آمریکا");
  const [amount, setAmount] = useState<string>('');
  const [moneyExchanged, setMoneyExchanged] = useState<number>(0);
  const [isShown, setIsShown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function firstCurrencyHandler(e: React.ChangeEvent<HTMLSelectElement>) {
    setFirstCurrency(e.target.value);
    setFirstCurrencyInString(e.target.options[e.target.selectedIndex].text);
    setIsShown(false);
  }

  function secondCurrencyHandler(e: React.ChangeEvent<HTMLSelectElement>) {
    setSecondCurrency(e.target.value);
    setSecondCurrencyInString(e.target.options[e.target.selectedIndex].text);
    setIsShown(false);
  }

  function reverseHandler() {
    setFirstCurrency(secondCurrency);
    setSecondCurrency(firstCurrency);
    setFirstCurrencyInString(secondCurrencyInString);
    setSecondCurrencyInString(firstCurrencyInString);
    setIsShown(false);
  }

  function amountHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value);
    setIsShown(false);
  }

  interface currency {
    value: string;
    change: number;
    timestamp: number;
    date: string;
  }

  async function getTheValue(currency: string) {
    if (currency != "irr") {
      try {
        const response = await fetch(
          "https://api.navasan.tech/latest/?api_key=freeqeyshoYfCGcJ3od5XtQnbXvAF40E" +
            `&item=${currency}`
        );

        if (response.ok) {
          const data = await response.json();
          const value = Number((Object.values(data)[0] as currency).value);
          return value;
        } else {
          throw new Error("oops!");
        }
      } catch (error) {
        return -1;
      }
    } else {
      return 0.1;
    }
  }

  async function exchangeHandler() {
    if (firstCurrency === secondCurrency) {
      setMoneyExchanged(Number(amount));
      setIsShown(true);
    } else {
      setIsLoading(true)
      const firstValue = (await getTheValue(firstCurrency)) * 10;
      const secondValue = (await getTheValue(secondCurrency)) * 10;
      const result = Number(
        ((firstValue * Number(amount)) / secondValue).toFixed(1)
      );
      setMoneyExchanged(firstValue === -1 || secondValue === -1 ? -1 : result);
      setIsShown(true);
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center w-full h-screen bg-[url('https://wallpaperaccess.com/full/2847970.jpg')] bg-gray-500/80 bg-blend-multiply">
      <section className="flex flex-col items-start w-full max-w-[500px] border border-[hsla(0,0%,84%)] p-6 rounded-2xl bg-[#f5f5f5] gap-3 font-bold">
        <h1 className="mx-auto font-bold text-2xl">مبدل ارز ریرا</h1>

        <label htmlFor="from" className="text-xl"> از : </label>
        <select
          className="w-full rounded-xl bg-[#3e3e3e] text-white p-3 cursor-pointer"
          name="firstCurrency"
          value={firstCurrency}
          onChange={(e) => firstCurrencyHandler(e)}
          id="from"
        >
          <option value="irr">ریال ایران</option>
          <option value="usd">دلار آمریکا</option>
          <option value="aud">دلار استرالیا</option>
          <option value="cad">دلار کانادا</option>
          <option value="eur">یورو</option>
          <option value="gbp">پوند انگلیس</option>
          <option value="jpy">ین ژاپن</option>
          <option value="try">لیر ترکیه</option>
          <option value="aed">درهم امارات</option>
        </select>

        <button
          type="button"
          onClick={reverseHandler}
          className="bg-gray-300 border p-2 rounded-xl -mb-6 rotate-90 text-3xl mx-auto cursor-pointer"
        >
          <CiRepeat />
        </button>

        <label htmlFor="to" className="text-xl">به :</label>
        <select
          className="w-full rounded-xl bg-[#3e3e3e] text-white p-3 cursor-pointer"
          name="secondCurrency"
          value={secondCurrency}
          onChange={(e) => secondCurrencyHandler(e)}
          id="to"
        >
          <option value="usd">دلار آمریکا</option>
          <option value="irr">ریال ایران</option>
          <option value="aud">دلار استرالیا</option>
          <option value="cad">دلار کانادا</option>
          <option value="eur">یورو</option>
          <option value="gbp">پوند انگلیس</option>
          <option value="jpy">ین ژاپن</option>
          <option value="try">لیر ترکیه</option>
          <option value="aed">درهم امارات</option>
        </select>

        <label htmlFor="amount" className="text-xl mt-3"> مقدار : </label>
        <input
          className="border border-[hsla(0,0%,84%)] w-full rounded-xl p-3 bg-white font-bold"
          id="amount"
          type="number"
          name="amount"
          placeholder='مقدار را وارد کنید'
          value={amount}
          onChange={(e) => amountHandler(e)}
        />

        <button
          className="w-full rounded-xl bg-[#3e3e3e] text-white p-3 mt-6 cursor-pointer"
          disabled={Number(amount) <= 0 || isLoading}
          onClick={exchangeHandler}
        >
          {isLoading ? <ClipLoader color="aqua"/> : 'تبدیل'}
        </button>

        {isShown && (
          <div className="w-full text-lg rounded-xl bg-white flex justify-center items-center border border-[hsla(0,0%,84%)] py-5 mt-4">
            {moneyExchanged < 0 ? (
              <p>مشکلی وجود دارد لطفا دوباره تلاش کنید . از فیلترشکن استفاده کنید</p>
            ) : (
              <p>
                {`${Number(amount).toLocaleString(
                  "fa-IR"
                )} ${firstCurrencyInString} = ${moneyExchanged.toLocaleString(
                  "fa-IR"
                )} ${secondCurrencyInString}`}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
