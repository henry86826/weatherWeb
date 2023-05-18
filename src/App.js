import { useState, useEffect } from "react";

import { ReactComponent as DayCloudyIcon } from "./images/day-cloudy.svg";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RefereshIcon } from "./images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";

import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";

import dayjs from "dayjs";

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShodow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const WeatherCard = styled.div`
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-top: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  font-size: 96px;
  color: ${({ theme }) => theme.temperatureColor};
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }

  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

const ChangeBtn = styled.button`
  background-color: ${({ theme }) => theme.textColor};
  width: 15rem;
  height: 3rem;
  font-size: 1.3rem;
  font-weight: bold;
`;

const DataBtn = styled.button`
  background-color: ${({ theme }) => theme.textColor};
  width: 15rem;
  height: 3rem;
  font-size: 1.3rem;
  font-weight: bold;
  margin-top: 2rem;
`;

function App() {
  const [currentTheme, setCurrentTheme] = useState("light");
  const handleBtn = () => {
    if (currentTheme === "light") {
      setCurrentTheme("dark");
    } else {
      setCurrentTheme("light");
    }
  };

  const [currentWeather, setCurrentWeather] = useState({
    locationName: "臺中市",
    description: "多雲時晴",
    windSpeed: 1.1,
    temperature: 22.9,
    rainPossibility: 48.3,
    observationTime: "2023-05-18 09:39:00",
    isLoading: true,
  });

  const {
    locationName,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    observationTime,
    isLoading,
  } = currentWeather;

  const AUTOORIZATION_KEY = "CWB-B458AEEF-4EB9-48D0-9CF5-0F06C138137D";
  const LOCATION_NAME = "467490";
  const fetchCurrentWeather = () => {
    setCurrentWeather((prevState) => ({ ...prevState, isLoading: true }));
    fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTOORIZATION_KEY}&stationId=${LOCATION_NAME}
      `
    )
      .then((res) => res.json())
      .then((data) => {
        const locationData = data.records.location[0];
        const weatherElement = locationData.weatherElement.reduce(
          (neededElement, item) => {
            // console.log(item);
            console.log(neededElement);
            if (["WDSD", "TEMP"].includes(item.elementName)) {
              neededElement[item.elementName] = item.elementValue;
            }
            return neededElement;
          },
          {}
        );

        setCurrentWeather({
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElement.TEMP,
          windSpeed: weatherElement.WDSD,
          description: "多雲時晴",
          rainPossibility: 60,
          isLoading: false,
        });

        // const rainRate =
        //   data.records.location[0].weatherElement[1].time[0].parameter
        //     .parameterName;
        // console.log(rainRate);
        // setCurrentWeather({
        //   ...currentWeather,
        //   rainPossibility: rainRate,
        //   isLoading: false,
        // });
      });
  };

  useEffect(() => {
    // console.log("exectue effect");
    fetchCurrentWeather();
  }, []);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard>
          <Location>{locationName}</Location>
          <Description> {description}</Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(temperature)} <Celsius>C</Celsius>
            </Temperature>
            <DayCloudy />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon />
            {windSpeed} m/h
          </AirFlow>
          <Rain>
            <RainIcon />
            {rainPossibility}%
          </Rain>
          <Refresh onClick={fetchCurrentWeather} isLoading={isLoading}>
            最後觀察時間：
            {new Intl.DateTimeFormat("zh-TW", {
              hour: "numeric",
              minute: "numeric",
            }).format(dayjs(observationTime))}{" "}
            {isLoading ? <LoadingIcon /> : <RefereshIcon />}
          </Refresh>
        </WeatherCard>
        <ChangeBtn onClick={handleBtn}>變更主題顏色</ChangeBtn>
        <DataBtn onClick={fetchCurrentWeather}>取得最近天氣資料</DataBtn>
      </Container>
    </ThemeProvider>
  );
}

export default App;
