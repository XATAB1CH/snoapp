-- Миграция для создания таблиц
BEGIN;

-- Создание таблицы news
CREATE TABLE IF NOT EXISTS public.news
(
    news_id integer NOT NULL DEFAULT nextval('news_id_seq'::regclass),
    title text COLLATE pg_catalog."default" NOT NULL,
    link text COLLATE pg_catalog."default" NOT NULL,
    image_url text COLLATE pg_catalog."default",
    CONSTRAINT news_pkey PRIMARY KEY (news_id)
);

-- Создание таблицы products
CREATE TABLE IF NOT EXISTS public.products
(
    product_id serial NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    price numeric(10, 2) NOT NULL,
    image_url text COLLATE pg_catalog."default",
    CONSTRAINT products_pkey PRIMARY KEY (product_id)
);

-- Создание таблицы students
CREATE TABLE IF NOT EXISTS public.students
(
    tg_id bigint NOT NULL,
    tg_name text COLLATE pg_catalog."default" NOT NULL,
    first_name text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    last_name text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    vk_url text COLLATE pg_catalog."default" NOT NULL,
    profile_img text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    balance integer NOT NULL,
    total_balance integer NOT NULL,
    CONSTRAINT students_pkey PRIMARY KEY (tg_id)
);

COMMIT;
