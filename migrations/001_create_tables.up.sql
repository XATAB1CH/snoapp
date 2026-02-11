-- Миграция для создания таблиц
BEGIN;

-- Создание последовательности для news_id
CREATE SEQUENCE IF NOT EXISTS news_id_seq;

-- Создание таблицы news
CREATE TABLE IF NOT EXISTS public.news
(
    news_id integer NOT NULL DEFAULT nextval('news_id_seq'::regclass),
    title text NOT NULL,
    link text NOT NULL,
    image_url text,
    CONSTRAINT news_pkey PRIMARY KEY (news_id)
);

-- Создание таблицы products
CREATE TABLE IF NOT EXISTS public.products
(
    product_id serial PRIMARY KEY,  -- Используем serial для auto-increment
    name text NOT NULL,
    price numeric(10, 2) NOT NULL,
    image_url text
);

-- Создание таблицы students
CREATE TABLE IF NOT EXISTS public.students
(
    tg_id bigint NOT NULL,
    tg_name text NOT NULL,
    first_name text NOT NULL DEFAULT ''::text,
    last_name text NOT NULL DEFAULT ''::text,
    vk_url text NOT NULL,
    profile_img text NOT NULL DEFAULT ''::text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    balance integer NOT NULL,
    total_balance integer NOT NULL,
    CONSTRAINT students_pkey PRIMARY KEY (tg_id)
);

COMMIT;
