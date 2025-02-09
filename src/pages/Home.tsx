
import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { Icon } from "@iconify/react";

import Dropdown from "../components/Dropdown"
import Input from "../components/Input"
import Button from "../components/Button"
import { findCost, getCities } from "../api"

const couriers = [
    { value: "jne", label: "JNE" },
    { value: "tiki", label: "TIKI" },
    { value: "pos", label: "POS Indonesia" },
]

type ShippingCost = {
    value: number;
    etd: string;
    note: string;
};

type ShippingService = {
    service: string;
    description: string;
    cost: ShippingCost[];
};

type RajaOngkirResponse = {
    code: string;
    name: string;
    costs: ShippingService[];
};

interface city {
    city_id: number
    city_name: string
    province_id: number
    province: string
    type: string
    postal_code: number
}

interface DropdownOption {
    value: string
    label: string
}

export default function HomePage() {
    const [originCity, setOriginCity] = useState<DropdownOption | null>(null)
    const [destinationCity, setDestinationCity] = useState<DropdownOption | null>(null)
    const [weight, setWeight] = useState("")
    const [courier, setCourier] = useState("")
    const [estimatedPrice, setEstimatedPrice] = useState<RajaOngkirResponse | null>(null)
    const [isError, setIsError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorCalculate, setError] = useState<boolean>(false)
    const [cities, setCities] = useState([])

    const navigate = useNavigate()

    function checkAuth() {
        const token = Cookies.get("authToken");
        if (!token) {
            navigate("/")
        }
    }

    async function fetchCity() {
        try {
            const response = await getCities()
            const temp = response.data.map((item: city) => {
                return {
                    value: item.city_id,
                    label: item.city_name
                }
            })
            setCities(temp)
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }

    async function handleCalculation() {
        if (!originCity || !destinationCity || !weight || !courier) {
            setIsError(true)
            return
        }
        setIsLoading(true)
        try {
            const response = await findCost({ origin: originCity.value, destination: destinationCity.value, weight: Number(weight) || 0, courier })
            if (response.status == 200) {
                const temp = response.data[0];
                setEstimatedPrice(temp)
            }
        } catch (error: unknown) {
            setError(true)
            setIsLoading(false)
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }

        setTimeout(() => {
            setIsLoading(false)
        }, 300);
    }

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        const cleanedValue = newValue.replace(/^0+(?=\d)/, "")
        setWeight(cleanedValue)
    }

    useEffect(() => {
        setEstimatedPrice(null)
    }, [originCity, destinationCity, weight, courier])

    useEffect(() => {
        fetchCity()
        checkAuth()
    }, [])

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Estimasi Harga Pengiriman</h1>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
                    <div className=" space-y-1">
                        <Dropdown label="Kota Asal" options={cities} value={originCity?.value || ''} onChange={(e) => setOriginCity(e)} required withSearch={true} />
                        {isError && !originCity && (
                            <p className="text-red-300 text-sm" >Value must be required</p>
                        )}
                    </div>

                    <div className=" space-y-1">
                        <Dropdown
                            label="Kota Tujuan"
                            options={cities}
                            value={destinationCity?.value || ''}
                            onChange={(e) => setDestinationCity(e)}
                            required
                            withSearch={true}
                        />
                        {isError && !destinationCity && (
                            <p className="text-red-300 text-sm" >Value must be required</p>
                        )}
                    </div>

                    <div className=" space-y-1">
                        <Input
                            label="Berat (gram)"
                            type="number"
                            value={weight}
                            onChange={handleWeightChange}

                            required
                            placeholder="Masukkan berat dalam gram"
                        />
                        {isError && !weight && (
                            <p className="text-red-300 text-sm" >Value must be required</p>
                        )}
                    </div>

                    <div className=" mb-6 space-y-1">
                        <Dropdown label="Kurir" options={couriers} value={courier} onChange={(e) => setCourier(e.value)} required />
                        {isError && !courier && (
                            <p className="text-red-300 text-sm" >Value must be required</p>
                        )}
                    </div>

                    <div className="">
                        <Button isLoading={isLoading} onClick={handleCalculation}>
                            Hitung Estimasi
                        </Button>
                        {errorCalculate && (
                            <p className="text-red-300 text-sm" >Request error, coba lagi besok.</p>
                        )}
                    </div>

                </div>
                {estimatedPrice !== null && (
                    <div className="mt-8 p-4 bg-blue-900 rounded-lg text-center">

                        <div className="mt-4 text-left">
                            <h3 className="text-lg font-semibold">Nama Kantor Pos: {estimatedPrice.name}</h3>

                            <div className="flex items-center gap-3">
                                <h3 className="text-sm font-semibold">Track Pengiriman:</h3>
                                <p className="text-sm">{originCity?.label}</p>
                                <Icon icon="solar:arrow-right-line-duotone" width="24" height="24" />
                                <p className="text-sm">{destinationCity?.label}</p>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold mb-2">Jenis Layanan:</h4>
                                <ul className="space-y-3">
                                    {estimatedPrice.costs.map((service, index) => (
                                        <li key={index} className="bg-primary-foreground/10 rounded-md p-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium">{service.service}</span>
                                            </div>
                                            <ul className="space-y-1">
                                                {service.cost.map((costDetail, costIndex) => (
                                                    <li key={costIndex} className="text-sm flex justify-between">
                                                        <span>Biaya: Rp {costDetail.value.toLocaleString("id-ID")}</span>
                                                        <span>Estimasi: {costDetail.etd} Hari</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

