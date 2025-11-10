--
-- PostgreSQL database dump
--

\restrict XFdaTNFTOY6DphxhKjqH6TDIHkn4YH17m6qZK03QbqyEyvOQKFrQk6Eqe38vNyc

-- Dumped from database version 17.6 (Ubuntu 17.6-0ubuntu0.25.04.1)
-- Dumped by pg_dump version 17.6 (Ubuntu 17.6-0ubuntu0.25.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public.account (
    id text NOT NULL,
    account_id text NOT NULL,
    provider_id text NOT NULL,
    user_id text NOT NULL,
    access_token text,
    refresh_token text,
    id_token text,
    access_token_expires_at timestamp without time zone,
    refresh_token_expires_at timestamp without time zone,
    scope text,
    password text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.account OWNER TO taia;

--
-- Name: appeals; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public.appeals (
    id text NOT NULL,
    case_id text NOT NULL,
    filed_by text,
    reason text,
    outcome character varying(50),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.appeals OWNER TO taia;

--
-- Name: cases; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public.cases (
    id text NOT NULL,
    title text NOT NULL,
    type character varying(50) NOT NULL,
    status character varying(50) NOT NULL,
    filed_by text,
    assigned_to text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cases OWNER TO taia;

--
-- Name: enforcement; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public.enforcement (
    id text NOT NULL,
    case_id text NOT NULL,
    officer_id text,
    action character varying(50),
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.enforcement OWNER TO taia;

--
-- Name: evidence; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public.evidence (
    id text NOT NULL,
    case_id text NOT NULL,
    description text,
    file_url text,
    submitted_by text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.evidence OWNER TO taia;

--
-- Name: hearings; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public.hearings (
    id text NOT NULL,
    case_id text NOT NULL,
    date timestamp without time zone NOT NULL,
    location text,
    judge_id text,
    bail_decision character varying(50),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.hearings OWNER TO taia;

--
-- Name: managed_lists; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public.managed_lists (
    id text NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    list json NOT NULL,
    created_by text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.managed_lists OWNER TO taia;

--
-- Name: pleas; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public.pleas (
    id text NOT NULL,
    case_id text NOT NULL,
    defendant_id text,
    plea_type character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pleas OWNER TO taia;

--
-- Name: proceeding_steps; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public.proceeding_steps (
    id text NOT NULL,
    template_id text NOT NULL,
    title text NOT NULL,
    description text,
    "order" integer NOT NULL,
    is_required boolean DEFAULT true,
    created_by text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.proceeding_steps OWNER TO taia;

--
-- Name: proceeding_templates; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public.proceeding_templates (
    id text NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    steps json NOT NULL,
    created_by text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.proceeding_templates OWNER TO taia;

--
-- Name: sentences; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public.sentences (
    id text NOT NULL,
    case_id text NOT NULL,
    sentence_type character varying(50) NOT NULL,
    duration integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sentences OWNER TO taia;

--
-- Name: session; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public.session (
    id text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    token text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    ip_address text,
    user_agent text,
    user_id text NOT NULL
);


ALTER TABLE public.session OWNER TO taia;

--
-- Name: trials; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public.trials (
    id text NOT NULL,
    case_id text NOT NULL,
    judge_id text,
    verdict character varying(20),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.trials OWNER TO taia;

--
-- Name: user; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public."user" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    image text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO taia;

--
-- Name: verification; Type: TABLE; Schema: public; Owner: taia
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.verification OWNER TO taia;

--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public.account (id, account_id, provider_id, user_id, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, scope, password, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: appeals; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public.appeals (id, case_id, filed_by, reason, outcome, created_at) FROM stdin;
\.


--
-- Data for Name: cases; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public.cases (id, title, type, status, filed_by, assigned_to, created_at) FROM stdin;
\.


--
-- Data for Name: enforcement; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public.enforcement (id, case_id, officer_id, action, notes, created_at) FROM stdin;
\.


--
-- Data for Name: evidence; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public.evidence (id, case_id, description, file_url, submitted_by, created_at) FROM stdin;
\.


--
-- Data for Name: hearings; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public.hearings (id, case_id, date, location, judge_id, bail_decision, created_at) FROM stdin;
\.


--
-- Data for Name: managed_lists; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public.managed_lists (id, name, description, list, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: pleas; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public.pleas (id, case_id, defendant_id, plea_type, created_at) FROM stdin;
\.


--
-- Data for Name: proceeding_steps; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public.proceeding_steps (id, template_id, title, description, "order", is_required, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: proceeding_templates; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public.proceeding_templates (id, name, description, steps, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: sentences; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public.sentences (id, case_id, sentence_type, duration, created_at) FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public.session (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) FROM stdin;
3z0FVymAz02oajfudd4rf0MM9tIAT8Hx	2025-11-16 21:58:19.567	HHMomljQkPITQN4GKzPiZsJei7prG20m	2025-11-09 21:58:19.567	2025-11-09 21:58:19.567	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	1XZALLaIEB60n7ZDWN6TJS87Itr02Q04
r8ajC1BqUTRK7MdltLqUkQJF51Yr1W13	2025-11-16 22:01:44.888	iT6pExIULWpVsVlKw0Exc6uzvBdJ9uRg	2025-11-09 22:01:44.888	2025-11-09 22:01:44.888	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	IIvgCIxpRAvERYvjqtmOSsR95HOK7Ejn
RH89HoGTKm7nAHoL0v1hQ4DnPVwloozn	2025-11-16 22:07:17.992	1BNzoqswVMTm1GV48OliSlzEGzajKPwF	2025-11-09 22:07:17.992	2025-11-09 22:07:17.992	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	LZBa9KFx2GtA5tBmrMI5ycB7Yj4ozJC0
DTAZjyjgUqsC3uTswe7E88H5bK6zQoYB	2025-11-16 23:22:10.328	IDgPizdmb5kjjCZHxwGBay4jv73L4bOU	2025-11-09 23:22:10.328	2025-11-09 23:22:10.328	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	RcvUWeU9R2KypEebrAx6hjFXWbTBOoxe
\.


--
-- Data for Name: trials; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public.trials (id, case_id, judge_id, verdict, created_at) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public."user" (id, name, email, email_verified, image, created_at, updated_at) FROM stdin;
1XZALLaIEB60n7ZDWN6TJS87Itr02Q04		prism.aspa.blo@gmail.com	t	\N	2025-11-09 21:58:19.565	2025-11-09 21:58:19.565
IIvgCIxpRAvERYvjqtmOSsR95HOK7Ejn		prism.ppa.bmo@gmail.com	t	\N	2025-11-09 22:01:44.886	2025-11-09 22:01:44.886
LZBa9KFx2GtA5tBmrMI5ycB7Yj4ozJC0		prism.kua.blo@gmail.com	t	\N	2025-11-09 22:07:17.989	2025-11-09 22:07:17.989
RcvUWeU9R2KypEebrAx6hjFXWbTBOoxe		taiatiniyara@gmail.com	t	\N	2025-11-09 22:43:36.011	2025-11-09 22:43:36.011
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: taia
--

COPY public.verification (id, identifier, value, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: appeals appeals_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.appeals
    ADD CONSTRAINT appeals_pkey PRIMARY KEY (id);


--
-- Name: cases cases_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_pkey PRIMARY KEY (id);


--
-- Name: enforcement enforcement_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.enforcement
    ADD CONSTRAINT enforcement_pkey PRIMARY KEY (id);


--
-- Name: evidence evidence_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT evidence_pkey PRIMARY KEY (id);


--
-- Name: hearings hearings_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.hearings
    ADD CONSTRAINT hearings_pkey PRIMARY KEY (id);


--
-- Name: managed_lists managed_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.managed_lists
    ADD CONSTRAINT managed_lists_pkey PRIMARY KEY (id);


--
-- Name: pleas pleas_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.pleas
    ADD CONSTRAINT pleas_pkey PRIMARY KEY (id);


--
-- Name: proceeding_steps proceeding_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.proceeding_steps
    ADD CONSTRAINT proceeding_steps_pkey PRIMARY KEY (id);


--
-- Name: proceeding_templates proceeding_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.proceeding_templates
    ADD CONSTRAINT proceeding_templates_pkey PRIMARY KEY (id);


--
-- Name: sentences sentences_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.sentences
    ADD CONSTRAINT sentences_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: session session_token_unique; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_token_unique UNIQUE (token);


--
-- Name: trials trials_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.trials
    ADD CONSTRAINT trials_pkey PRIMARY KEY (id);


--
-- Name: user user_email_unique; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_unique UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: account account_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: appeals appeals_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.appeals
    ADD CONSTRAINT appeals_case_id_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- Name: appeals appeals_filed_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.appeals
    ADD CONSTRAINT appeals_filed_by_user_id_fk FOREIGN KEY (filed_by) REFERENCES public."user"(id);


--
-- Name: cases cases_assigned_to_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_assigned_to_user_id_fk FOREIGN KEY (assigned_to) REFERENCES public."user"(id);


--
-- Name: cases cases_filed_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_filed_by_user_id_fk FOREIGN KEY (filed_by) REFERENCES public."user"(id);


--
-- Name: enforcement enforcement_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.enforcement
    ADD CONSTRAINT enforcement_case_id_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- Name: enforcement enforcement_officer_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.enforcement
    ADD CONSTRAINT enforcement_officer_id_user_id_fk FOREIGN KEY (officer_id) REFERENCES public."user"(id);


--
-- Name: evidence evidence_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT evidence_case_id_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- Name: evidence evidence_submitted_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT evidence_submitted_by_user_id_fk FOREIGN KEY (submitted_by) REFERENCES public."user"(id);


--
-- Name: hearings hearings_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.hearings
    ADD CONSTRAINT hearings_case_id_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- Name: hearings hearings_judge_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.hearings
    ADD CONSTRAINT hearings_judge_id_user_id_fk FOREIGN KEY (judge_id) REFERENCES public."user"(id);


--
-- Name: managed_lists managed_lists_created_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.managed_lists
    ADD CONSTRAINT managed_lists_created_by_user_id_fk FOREIGN KEY (created_by) REFERENCES public."user"(id);


--
-- Name: pleas pleas_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.pleas
    ADD CONSTRAINT pleas_case_id_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- Name: pleas pleas_defendant_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.pleas
    ADD CONSTRAINT pleas_defendant_id_user_id_fk FOREIGN KEY (defendant_id) REFERENCES public."user"(id);


--
-- Name: proceeding_steps proceeding_steps_created_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.proceeding_steps
    ADD CONSTRAINT proceeding_steps_created_by_user_id_fk FOREIGN KEY (created_by) REFERENCES public."user"(id);


--
-- Name: proceeding_steps proceeding_steps_template_id_proceeding_templates_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.proceeding_steps
    ADD CONSTRAINT proceeding_steps_template_id_proceeding_templates_id_fk FOREIGN KEY (template_id) REFERENCES public.proceeding_templates(id);


--
-- Name: proceeding_templates proceeding_templates_created_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.proceeding_templates
    ADD CONSTRAINT proceeding_templates_created_by_user_id_fk FOREIGN KEY (created_by) REFERENCES public."user"(id);


--
-- Name: sentences sentences_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.sentences
    ADD CONSTRAINT sentences_case_id_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- Name: session session_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: trials trials_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.trials
    ADD CONSTRAINT trials_case_id_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- Name: trials trials_judge_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: taia
--

ALTER TABLE ONLY public.trials
    ADD CONSTRAINT trials_judge_id_user_id_fk FOREIGN KEY (judge_id) REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

\unrestrict XFdaTNFTOY6DphxhKjqH6TDIHkn4YH17m6qZK03QbqyEyvOQKFrQk6Eqe38vNyc

