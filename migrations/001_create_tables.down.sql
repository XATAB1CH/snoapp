-- Миграция для удаления таблиц
BEGIN;

-- Удаление таблицы students
DROP TABLE IF EXISTS public.students;

-- Удаление таблицы products
DROP TABLE IF EXISTS public.products;

-- Удаление таблицы news
DROP TABLE IF EXISTS public.news;

COMMIT;
