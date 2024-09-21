import { handle } from "hono/vercel";
import { createKysely } from "@vercel/postgres-kysely";
import createApp from "@publiz/api";
import { CamelCasePlugin, sql } from "kysely";

export const db = createKysely(undefined, {
  plugins: [new CamelCasePlugin()],
});

const app = createApp({
  db,
});

app.get("/api/run_initial_migration", async (c) => {
  const db = c.get("container").sqlDb;
  await sql`
    CREATE TYPE public.collection_type AS ENUM (
        'SYSTEM',
        'DEFAULT'
    );

    CREATE TYPE public.meta_schema_type AS ENUM (
        'SYSTEM',
        'DEFAULT'
    );

    CREATE TYPE public.post_status AS ENUM (
        'DRAFT',
        'PUBLISHED',
        'ARCHIVED'
    );

    CREATE TYPE public.post_type AS ENUM (
        'REVISION',
        'POST'
    );

    CREATE TYPE public.reaction_pack_type AS ENUM (
        'SYSTEM',
        'DEFAULT',
        'PRIVILEGE'
    );

    CREATE TYPE public.tag_type AS ENUM (
        'SYSTEM',
        'DEFAULT'
    );

    CREATE TYPE public.taxonomy_type AS ENUM (
        'SYSTEM',
        'DEFAULT'
    );

    CREATE FUNCTION public.auto_timestamps() RETURNS trigger
        LANGUAGE plpgsql
        AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$;

    CREATE FUNCTION public.create_updated_at_trigger(table_name text) RETURNS void
        LANGUAGE plpgsql
        AS $$
    BEGIN
        EXECUTE 'CREATE TRIGGER ' || table_name || '_updated_at BEFORE UPDATE ON ' || table_name || ' FOR EACH ROW EXECUTE PROCEDURE auto_timestamps()';
    END;
    $$;

    SET default_tablespace = '';
    SET default_table_access_method = heap;

    CREATE TABLE public.collections (
        id integer NOT NULL,
        name character varying(512) NOT NULL,
        user_id integer,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        type public.collection_type DEFAULT 'DEFAULT'::public.collection_type,
        organization_id integer,
        slug character varying(512) NOT NULL
    );

    CREATE SEQUENCE public.collections_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.collections_id_seq OWNED BY public.collections.id;

    CREATE TABLE public.collections_posts (
        id integer NOT NULL,
        collection_id integer,
        post_id integer,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
    );

    CREATE SEQUENCE public.collections_posts_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.collections_posts_id_seq OWNED BY public.collections_posts.id;

    CREATE TABLE public.comments (
        id integer NOT NULL,
        content text NOT NULL,
        parent_id integer,
        author_id integer NOT NULL,
        target character varying(16) NOT NULL,
        target_id integer NOT NULL,
        metadata jsonb,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
    );

    CREATE SEQUENCE public.comments_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;

    CREATE TABLE public.files (
        id integer NOT NULL,
        title character varying(512),
        description text,
        content_type character varying(100) NOT NULL,
        bucket character varying(255) DEFAULT ''::character varying,
        file_name character varying(255) NOT NULL,
        file_path text NOT NULL,
        metadata jsonb,
        user_id integer NOT NULL,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
    );

    CREATE SEQUENCE public.files_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;

    CREATE TABLE public.kysely_migration (
        name character varying(255) NOT NULL,
        "timestamp" character varying(255) NOT NULL
    );

    CREATE TABLE public.kysely_migration_lock (
        id character varying(255) NOT NULL,
        is_locked integer DEFAULT 0 NOT NULL
    );

    CREATE TABLE public.meta_schemas (
        id integer NOT NULL,
        name character varying(155) NOT NULL,
        version integer DEFAULT 1 NOT NULL,
        target character varying(16) NOT NULL,
        is_default boolean DEFAULT false NOT NULL,
        schema jsonb NOT NULL,
        type public.meta_schema_type DEFAULT 'DEFAULT'::public.meta_schema_type NOT NULL,
        organization_id integer,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        metadata jsonb DEFAULT '{}'::jsonb NOT NULL
    );

    CREATE SEQUENCE public.meta_schemas_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.meta_schemas_id_seq OWNED BY public.meta_schemas.id;

    CREATE TABLE public.organization_roles (
        id integer NOT NULL,
        name character varying(155) NOT NULL,
        organization_id integer NOT NULL,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
    );

    CREATE SEQUENCE public.organization_roles_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.organization_roles_id_seq OWNED BY public.organization_roles.id;

    CREATE TABLE public.organizations (
        id integer NOT NULL,
        name character varying(255) NOT NULL,
        slug character varying(255) NOT NULL,
        description text DEFAULT ''::text NOT NULL,
        metadata jsonb,
        verified boolean DEFAULT false NOT NULL,
        owner_id integer,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
    );

    CREATE SEQUENCE public.organizations_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.organizations_id_seq OWNED BY public.organizations.id;

    CREATE TABLE public.organizations_users (
        id integer NOT NULL,
        organization_id integer NOT NULL,
        user_id integer NOT NULL,
        organization_role_id integer,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
    );

    CREATE SEQUENCE public.organizations_users_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.organizations_users_id_seq OWNED BY public.organizations_users.id;

    CREATE TABLE public.posts (
        id integer NOT NULL,
        title character varying(512) NOT NULL,
        content text DEFAULT ''::text NOT NULL,
        content_json jsonb DEFAULT '{}'::jsonb NOT NULL,
        parent_id integer,
        author_id integer NOT NULL,
        organization_id integer,
        type public.post_type DEFAULT 'POST'::public.post_type NOT NULL,
        status public.post_status DEFAULT 'DRAFT'::public.post_status NOT NULL,
        metadata jsonb,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        meta_schema character varying(255) DEFAULT ''::character varying NOT NULL,
        public_id character varying(12) NOT NULL
    );

    CREATE SEQUENCE public.posts_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;

    CREATE TABLE public.posts_tags (
        id integer NOT NULL,
        post_id integer NOT NULL,
        tag_id integer NOT NULL,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
    );

    CREATE SEQUENCE public.posts_tags_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.posts_tags_id_seq OWNED BY public.posts_tags.id;

    CREATE TABLE public.reaction_packs (
        id integer NOT NULL,
        name character varying(155) NOT NULL,
        description text,
        organization_id integer,
        user_id integer,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        type public.reaction_pack_type DEFAULT 'DEFAULT'::public.reaction_pack_type,
        slug character varying(155) NOT NULL
    );

    CREATE SEQUENCE public.reaction_packs_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.reaction_packs_id_seq OWNED BY public.reaction_packs.id;

    CREATE TABLE public.reaction_packs_users (
        id integer NOT NULL,
        reaction_pack_id integer NOT NULL,
        user_id integer NOT NULL,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
    );

    CREATE SEQUENCE public.reaction_packs_users_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.reaction_packs_users_id_seq OWNED BY public.reaction_packs_users.id;

    CREATE TABLE public.reactions (
        id integer NOT NULL,
        name character varying(155) NOT NULL,
        reaction_pack_id integer NOT NULL,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        metadata jsonb,
        code character varying(155) NOT NULL
    );

    CREATE SEQUENCE public.reactions_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.reactions_id_seq OWNED BY public.reactions.id;

    CREATE TABLE public.reactions_posts (
        id integer NOT NULL,
        reaction_id integer,
        post_id integer,
        user_id integer,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
    );

    CREATE SEQUENCE public.reactions_posts_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.reactions_posts_id_seq OWNED BY public.reactions_posts.id;

    CREATE TABLE public.tags (
        id integer NOT NULL,
        name character varying(512) NOT NULL,
        slug character varying(512) NOT NULL,
        type public.tag_type DEFAULT 'DEFAULT'::public.tag_type NOT NULL,
        organization_id integer,
        parent_id integer,
        user_id integer NOT NULL,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        taxonomy_id integer
    );

    CREATE SEQUENCE public.tags_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;

    CREATE TABLE public.taxonomies (
        id integer NOT NULL,
        name character varying(512) NOT NULL,
        slug character varying(512) NOT NULL,
        type public.taxonomy_type DEFAULT 'DEFAULT'::public.taxonomy_type NOT NULL,
        organization_id integer,
        user_id integer NOT NULL,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
    );

    CREATE SEQUENCE public.taxonomies_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.taxonomies_id_seq OWNED BY public.taxonomies.id;

    CREATE TABLE public.users (
        id integer NOT NULL,
        auth_id character varying(255) NOT NULL,
        display_name character varying(100) NOT NULL,
        metadata jsonb,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
    );

    CREATE SEQUENCE public.users_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

    ALTER TABLE ONLY public.collections ALTER COLUMN id SET DEFAULT nextval('public.collections_id_seq'::regclass);

    ALTER TABLE ONLY public.collections_posts ALTER COLUMN id SET DEFAULT nextval('public.collections_posts_id_seq'::regclass);

    ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);

    ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);

    ALTER TABLE ONLY public.meta_schemas ALTER COLUMN id SET DEFAULT nextval('public.meta_schemas_id_seq'::regclass);

    ALTER TABLE ONLY public.organization_roles ALTER COLUMN id SET DEFAULT nextval('public.organization_roles_id_seq'::regclass);

    ALTER TABLE ONLY public.organizations ALTER COLUMN id SET DEFAULT nextval('public.organizations_id_seq'::regclass);

    ALTER TABLE ONLY public.organizations_users ALTER COLUMN id SET DEFAULT nextval('public.organizations_users_id_seq'::regclass);

    ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);

    ALTER TABLE ONLY public.posts_tags ALTER COLUMN id SET DEFAULT nextval('public.posts_tags_id_seq'::regclass);

    ALTER TABLE ONLY public.reaction_packs ALTER COLUMN id SET DEFAULT nextval('public.reaction_packs_id_seq'::regclass);

    ALTER TABLE ONLY public.reaction_packs_users ALTER COLUMN id SET DEFAULT nextval('public.reaction_packs_users_id_seq'::regclass);

    ALTER TABLE ONLY public.reactions ALTER COLUMN id SET DEFAULT nextval('public.reactions_id_seq'::regclass);

    ALTER TABLE ONLY public.reactions_posts ALTER COLUMN id SET DEFAULT nextval('public.reactions_posts_id_seq'::regclass);

    ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);

    ALTER TABLE ONLY public.taxonomies ALTER COLUMN id SET DEFAULT nextval('public.taxonomies_id_seq'::regclass);

    ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

    ALTER TABLE ONLY public.collections
        ADD CONSTRAINT collections_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.collections_posts
        ADD CONSTRAINT collections_posts_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.collections
        ADD CONSTRAINT collections_slug_key UNIQUE (slug);

    ALTER TABLE ONLY public.comments
        ADD CONSTRAINT comments_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.files
        ADD CONSTRAINT files_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.kysely_migration_lock
        ADD CONSTRAINT kysely_migration_lock_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.kysely_migration
        ADD CONSTRAINT kysely_migration_pkey PRIMARY KEY (name);

    ALTER TABLE ONLY public.meta_schemas
        ADD CONSTRAINT meta_schemas_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.organization_roles
        ADD CONSTRAINT organization_roles_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.organizations
        ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.organizations
        ADD CONSTRAINT organizations_slug_key UNIQUE (slug);

    ALTER TABLE ONLY public.organizations_users
        ADD CONSTRAINT organizations_users_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.posts
        ADD CONSTRAINT posts_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.posts
        ADD CONSTRAINT posts_public_id_key UNIQUE (public_id);

    ALTER TABLE ONLY public.posts_tags
        ADD CONSTRAINT posts_tags_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.reaction_packs
        ADD CONSTRAINT reaction_packs_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.reaction_packs_users
        ADD CONSTRAINT reaction_packs_users_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.reactions
        ADD CONSTRAINT reactions_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.reactions_posts
        ADD CONSTRAINT reactions_posts_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.tags
        ADD CONSTRAINT tags_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.tags
        ADD CONSTRAINT tags_slug_key UNIQUE (slug);

    ALTER TABLE ONLY public.taxonomies
        ADD CONSTRAINT taxonomies_pkey PRIMARY KEY (id);

    ALTER TABLE ONLY public.taxonomies
        ADD CONSTRAINT taxonomies_slug_key UNIQUE (slug);

    ALTER TABLE ONLY public.users
        ADD CONSTRAINT users_auth_id_key UNIQUE (auth_id);

    ALTER TABLE ONLY public.users
        ADD CONSTRAINT users_pkey PRIMARY KEY (id);

    CREATE UNIQUE INDEX collections_posts_collection_id_post_id_uniq ON public.collections_posts USING btree (collection_id, post_id);

    CREATE INDEX comments_metadata_gin ON public.comments USING gin (metadata);

    CREATE INDEX files_metadata_gin ON public.files USING gin (metadata);

    CREATE INDEX meta_schemas_metadata_gin ON public.meta_schemas USING gin (metadata);

    CREATE UNIQUE INDEX meta_schemas_name_version_organization_id_unique ON public.meta_schemas USING btree (name, version, organization_id);

    CREATE INDEX meta_schemas_organization_id ON public.meta_schemas USING btree (organization_id);

    CREATE UNIQUE INDEX organization_roles_name_organization_id_unique ON public.organization_roles USING btree (name, organization_id);

    CREATE INDEX organization_roles_organization_id ON public.organization_roles USING btree (organization_id);

    CREATE INDEX organizations_metadata_gin ON public.organizations USING gin (metadata);

    CREATE INDEX organizations_owner_id ON public.organizations USING btree (owner_id);

    CREATE INDEX organizations_users_organization_id ON public.organizations_users USING btree (organization_id);

    CREATE INDEX organizations_users_user_id ON public.organizations_users USING btree (user_id);

    CREATE INDEX posts_meta_schema ON public.posts USING btree (meta_schema);

    CREATE INDEX posts_metadata_gin ON public.posts USING gin (metadata);

    CREATE INDEX posts_public_id ON public.posts USING btree (public_id);

    CREATE INDEX posts_tags_post_id_tag_id_idx ON public.posts_tags USING btree (post_id, tag_id);

    CREATE UNIQUE INDEX posts_tags_post_id_tag_id_uniq ON public.posts_tags USING btree (post_id, tag_id);

    CREATE UNIQUE INDEX reaction_packs_slug_organization_id_uniq ON public.reaction_packs USING btree (slug, organization_id) NULLS NOT DISTINCT;

    CREATE UNIQUE INDEX reaction_packs_users_reaction_pack_id_user_id_uniq ON public.reaction_packs_users USING btree (reaction_pack_id, user_id);

    CREATE INDEX reaction_packs_users_user_id ON public.reaction_packs_users USING btree (user_id);

    CREATE UNIQUE INDEX reactions_posts_reaction_id_post_id_user_id_uniq ON public.reactions_posts USING btree (reaction_id, post_id, user_id);

    CREATE UNIQUE INDEX reactions_reaction_pack_id_code_uniq ON public.reactions USING btree (reaction_pack_id, code);

    CREATE INDEX tags_taxonomy_id ON public.tags USING btree (taxonomy_id);

    CREATE INDEX taxonomies_organization_id ON public.taxonomies USING btree (organization_id);

    CREATE INDEX users_metadata_gin ON public.users USING gin (metadata);

    CREATE TRIGGER collections_posts_updated_at BEFORE UPDATE ON public.collections_posts FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    CREATE TRIGGER collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    CREATE TRIGGER comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    CREATE TRIGGER files_updated_at BEFORE UPDATE ON public.files FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    CREATE TRIGGER meta_schemas_updated_at BEFORE UPDATE ON public.meta_schemas FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    CREATE TRIGGER organization_roles_updated_at BEFORE UPDATE ON public.organization_roles FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    CREATE TRIGGER organizations_users_updated_at BEFORE UPDATE ON public.organizations_users FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    CREATE TRIGGER posts_tags_updated_at BEFORE UPDATE ON public.posts_tags FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    CREATE TRIGGER posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    CREATE TRIGGER reaction_packs_updated_at BEFORE UPDATE ON public.reaction_packs FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    CREATE TRIGGER reactions_updated_at BEFORE UPDATE ON public.reactions FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    CREATE TRIGGER tags_updated_at BEFORE UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    CREATE TRIGGER taxonomies_updated_at BEFORE UPDATE ON public.taxonomies FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.auto_timestamps();

    ALTER TABLE ONLY public.collections
        ADD CONSTRAINT collections_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

    ALTER TABLE ONLY public.collections_posts
        ADD CONSTRAINT collections_posts_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(id);

    ALTER TABLE ONLY public.collections_posts
        ADD CONSTRAINT collections_posts_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);

    ALTER TABLE ONLY public.collections
        ADD CONSTRAINT collections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

    ALTER TABLE ONLY public.comments
        ADD CONSTRAINT comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);

    ALTER TABLE ONLY public.comments
        ADD CONSTRAINT comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.comments(id);

    ALTER TABLE ONLY public.files
        ADD CONSTRAINT files_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

    ALTER TABLE ONLY public.meta_schemas
        ADD CONSTRAINT meta_schemas_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

    ALTER TABLE ONLY public.organization_roles
        ADD CONSTRAINT organization_roles_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

    ALTER TABLE ONLY public.organizations
        ADD CONSTRAINT organizations_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;

    ALTER TABLE ONLY public.organizations_users
        ADD CONSTRAINT organizations_users_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

    ALTER TABLE ONLY public.organizations_users
        ADD CONSTRAINT organizations_users_organization_role_id_fkey FOREIGN KEY (organization_role_id) REFERENCES public.organization_roles(id);

    ALTER TABLE ONLY public.organizations_users
        ADD CONSTRAINT organizations_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

    ALTER TABLE ONLY public.posts
        ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);

    ALTER TABLE ONLY public.posts
        ADD CONSTRAINT posts_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

    ALTER TABLE ONLY public.posts
        ADD CONSTRAINT posts_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.posts(id) ON DELETE SET NULL;

    ALTER TABLE ONLY public.posts_tags
        ADD CONSTRAINT posts_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);

    ALTER TABLE ONLY public.posts_tags
        ADD CONSTRAINT posts_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id);

    ALTER TABLE ONLY public.reaction_packs
        ADD CONSTRAINT reaction_packs_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

    ALTER TABLE ONLY public.reaction_packs
        ADD CONSTRAINT reaction_packs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

    ALTER TABLE ONLY public.reaction_packs_users
        ADD CONSTRAINT reaction_packs_users_reaction_pack_id_fkey FOREIGN KEY (reaction_pack_id) REFERENCES public.reaction_packs(id);

    ALTER TABLE ONLY public.reaction_packs_users
        ADD CONSTRAINT reaction_packs_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

    ALTER TABLE ONLY public.reactions_posts
        ADD CONSTRAINT reactions_posts_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);

    ALTER TABLE ONLY public.reactions_posts
        ADD CONSTRAINT reactions_posts_reaction_id_fkey FOREIGN KEY (reaction_id) REFERENCES public.reactions(id);

    ALTER TABLE ONLY public.reactions_posts
        ADD CONSTRAINT reactions_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

    ALTER TABLE ONLY public.reactions
        ADD CONSTRAINT reactions_reaction_pack_id_fkey FOREIGN KEY (reaction_pack_id) REFERENCES public.reaction_packs(id);

    ALTER TABLE ONLY public.tags
        ADD CONSTRAINT tags_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

    ALTER TABLE ONLY public.tags
        ADD CONSTRAINT tags_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.tags(id) ON DELETE SET NULL;

    ALTER TABLE ONLY public.tags
        ADD CONSTRAINT tags_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

    ALTER TABLE ONLY public.taxonomies
        ADD CONSTRAINT taxonomies_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

    ALTER TABLE ONLY public.taxonomies
        ADD CONSTRAINT taxonomies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

    INSERT INTO public.kysely_migration VALUES ('202401031409_create_users_table', '2024-09-21T11:18:10.023Z');
    INSERT INTO public.kysely_migration VALUES ('202401031531_create_organizations_table', '2024-09-21T11:18:10.038Z');
    INSERT INTO public.kysely_migration VALUES ('202401031535_create_files_table', '2024-09-21T11:18:10.049Z');
    INSERT INTO public.kysely_migration VALUES ('202401031542_create_posts_table', '2024-09-21T11:18:10.057Z');
    INSERT INTO public.kysely_migration VALUES ('202401031737_create_tags_table', '2024-09-21T11:18:10.074Z');
    INSERT INTO public.kysely_migration VALUES ('202401031750_create_collections_table', '2024-09-21T11:18:10.084Z');
    INSERT INTO public.kysely_migration VALUES ('202401071544_create_reactions_table', '2024-09-21T11:18:10.096Z');
    INSERT INTO public.kysely_migration VALUES ('202401212005_create_roles_table', '2024-09-21T11:18:10.116Z');
    INSERT INTO public.kysely_migration VALUES ('202401231807_create_meta_schemas_table', '2024-09-21T11:18:10.133Z');
    INSERT INTO public.kysely_migration VALUES ('202402010943_create_comments_table', '2024-09-21T11:18:10.142Z');
    INSERT INTO public.kysely_migration VALUES ('202403251037_create_taxonomies_table', '2024-09-21T11:18:10.158Z');
    INSERT INTO public.kysely_migration VALUES ('202405071043_add_type_to_collections_table', '2024-09-21T11:18:10.162Z');
    INSERT INTO public.kysely_migration VALUES ('202405071443_add_unique_compound_keys_for_m2m_table', '2024-09-21T11:18:10.167Z');
    INSERT INTO public.kysely_migration VALUES ('202405121656_add_auto_updated_at_and_use_for_existing_tables', '2024-09-21T11:18:10.173Z');
    INSERT INTO public.kysely_migration VALUES ('202405180943_update_reaction_moderation_support_table', '2024-09-21T11:18:10.196Z');
    INSERT INTO public.kysely_migration VALUES ('202406261445_add_meta_schema_to_posts_table', '2024-09-21T11:18:10.201Z');
    INSERT INTO public.kysely_migration VALUES ('202407150858_add_public_id_to_posts_table', '2024-09-21T11:18:10.209Z');
    INSERT INTO public.kysely_migration VALUES ('202407251622_add_metadata_to_meta_schemas_table', '2024-09-21T11:18:10.210Z');
    INSERT INTO public.kysely_migration VALUES ('202407252127_alter_content_type_length_files_table', '2024-09-21T11:18:10.211Z');

    INSERT INTO public.kysely_migration_lock VALUES ('migration_lock', 0);
`.execute(db);
  return c.json({}, 200);
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
