import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { CategoryActions } from './CategoryActions'

export default function CategoryList() {
  const [categories, setCategories] = useState([])
  const fk_store_id = sessionStorage.getItem('fk_store_id')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(`/category/all?fk_store_id=${fk_store_id}`)

        if (response.data.success) {
          setCategories(response.data.data)
        } else {
          console.warn('Nenhum produto encontrado.')
        }
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
      }
    }

    fetchCategories()
  }, [fk_store_id])

  return (
    <Table>
      <TableCaption>Lista de categorias cadastradas</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Imagem</TableHead>
          <TableHead>Título</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>
              <img src={category.image || '/assets/image.png'} alt={category.title} className='w-12 h-12 object-cover rounded' />
            </TableCell>
            <TableCell>{category.title}</TableCell>
            <TableCell className='text-right'>
              <CategoryActions category={category} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
