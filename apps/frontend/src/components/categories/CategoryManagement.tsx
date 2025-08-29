import React, { useState, useEffect } from 'react';
import { useProductCatalogContext } from '../../contexts/ProductCatalogContext';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Form validation schema
const categorySchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  slug: yup.string().required('Slug is required'),
  description: yup.string(),
  parentId: yup.string().nullable(),
  isActive: yup.boolean().default(true),
  isFeatured: yup.boolean().default(false),
});

type CategoryFormData = yup.InferType<typeof categorySchema>;

const CategoryManagement: React.FC = () => {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useProductCatalogContext();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parentId: null,
      isActive: true,
      isFeatured: false,
    },
  });

  // Watch for name changes to auto-generate slug
  const nameValue = watch('name');
  useEffect(() => {
    if (nameValue && !editingCategory) {
      const slug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug, { shouldValidate: true });
    }
  }, [nameValue, setValue, editingCategory]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle dialog open for new category
  const handleOpenDialog = () => {
    reset();
    setEditingCategory(null);
    setOpenDialog(true);
  };

  // Handle dialog open for editing category
  const handleEditDialog = (category: any) => {
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId || null,
      isActive: category.isActive ?? true,
      isFeatured: category.isFeatured ?? false,
    });
    setEditingCategory(category.id);
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset();
    setEditingCategory(null);
  };

  // Handle category submission
  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory, data);
        setSnackbar({
          open: true,
          message: 'Category updated successfully',
          severity: 'success',
        });
      } else {
        await createCategory(data);
        setSnackbar({
          open: true,
          message: 'Category created successfully',
          severity: 'success',
        });
      }
      handleCloseDialog();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${editingCategory ? 'update' : 'create'} category`,
        severity: 'error',
      });
    }
  };

  // Handle category deletion
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        setSnackbar({
          open: true,
          message: 'Category deleted successfully',
          severity: 'success',
        });
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete category',
          severity: 'error',
        });
      }
    }
  };

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Category Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Category
        </Button>
      </Box>

      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      {/* Categories Table */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            Categories
          </Typography>
          <Tooltip title="Refresh">
            <IconButton 
              size="small" 
              onClick={fetchCategories}
              disabled={loading}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Featured</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary" gutterBottom>
                      No categories found
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="small" 
                      onClick={handleOpenDialog}
                      startIcon={<AddIcon />}
                    >
                      Add your first category
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                categories
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((category) => (
                    <TableRow key={category.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: 'action.hover',
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                            }}
                          >
                            <CategoryIcon color="action" />
                          </Box>
                          <Typography variant="body2" fontWeight="medium">
                            {category.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">/{category.slug}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        {category.isActive ? (
                          <Typography color="success.main" variant="body2">
                            Active
                          </Typography>
                        ) : (
                          <Typography color="text.disabled" variant="body2">
                            Inactive
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {category.isFeatured ? (
                          <Typography color="primary" variant="body2">
                            Yes
                          </Typography>
                        ) : (
                          <Typography color="text.disabled" variant="body2">
                            No
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" justifyContent="flex-end">
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditDialog(category)}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDelete(category.id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {categories.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={categories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      {/* Add/Edit Category Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Category Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Slug"
                    fullWidth
                    margin="normal"
                    error={!!errors.slug}
                    helperText={errors.slug?.message}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                  />
                )}
              />

              <Controller
                name="parentId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="parent-category-label">Parent Category</InputLabel>
                    <Select
                      {...field}
                      labelId="parent-category-label"
                      label="Parent Category"
                    >
                      <MenuItem value="">None (Root Category)</MenuItem>
                      {categories
                        .filter(cat => !editingCategory || cat.id !== editingCategory)
                        .map(category => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Box display="flex" gap={2} mt={2}>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={e => field.onChange(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Active"
                    />
                  )}
                />

                <Controller
                  name="isFeatured"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={e => field.onChange(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Featured"
                    />
                  )}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editingCategory ? 'Update' : 'Create'} Category
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CategoryManagement;
