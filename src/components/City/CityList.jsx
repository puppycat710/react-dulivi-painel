import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { CityActions } from './CityActions'

export default function CityList() {
  const [cities, setCities] = useState([])
  const fk_store_id = sessionStorage.getItem('fk_store_id')

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await api.get(`/city/all?fk_store_id=${fk_store_id}`)

        if (response.data.success) {
          setCities(response.data.data)
        } else {
          console.warn('Nenhum produto encontrado.')
        }
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
      }
    }

    fetchCities()
  }, [fk_store_id])

  return (
    <Table>
      <TableCaption>Lista de categorias cadastradas</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Cidade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cities.map((city) => (
          <TableRow key={city.id}>
            <TableCell>{city.name}</TableCell>
            <TableCell className='text-right'>
              <CityActions city={city} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
