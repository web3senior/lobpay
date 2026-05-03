-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 03, 2026 at 04:54 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lobpay`
--

-- --------------------------------------------------------

--
-- Table structure for table `agents`
--

CREATE TABLE `agents` (
  `id` int(11) NOT NULL,
  `wallet_address` varchar(42) NOT NULL,
  `erc8004_identity` varchar(42) DEFAULT NULL,
  `agent_name` varchar(100) DEFAULT NULL,
  `api_key` varchar(64) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expire_at` timestamp NULL DEFAULT NULL,
  `request_count` int(11) NOT NULL DEFAULT 0,
  `last_request_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `agents`
--

INSERT INTO `agents` (`id`, `wallet_address`, `erc8004_identity`, `agent_name`, `api_key`, `is_active`, `created_at`, `expire_at`, `request_count`, `last_request_at`) VALUES
(4, '0xeed4c09ec4fd49676caca7847cd5fbf3615da4d4', '0x0000000000000000000000000000000000000000', 'Atla', 'ak_live_b2f83532d711bec4aaf38ff13cff9bfcf589d585c4e7d330', 1, '2026-02-23 06:20:52', NULL, 0, NULL);

--
-- Triggers `agents`
--
DELIMITER $$
CREATE TRIGGER `before_agent_insert` BEFORE INSERT ON `agents` FOR EACH ROW BEGIN
    SET NEW.wallet_address = LOWER(NEW.wallet_address);
    IF NEW.erc8004_identity IS NOT NULL THEN
        SET NEW.erc8004_identity = LOWER(NEW.erc8004_identity);
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_agent_update` BEFORE UPDATE ON `agents` FOR EACH ROW BEGIN
    SET NEW.wallet_address = LOWER(NEW.wallet_address);
    IF NEW.erc8004_identity IS NOT NULL THEN
        SET NEW.erc8004_identity = LOWER(NEW.erc8004_identity);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `merchant_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT 'tag',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `merchant_id`, `name`, `description`, `icon`, `created_at`, `is_active`) VALUES
(1, 1, '🥤 Virtual Refreshments', 'Drinks', 'tag', '2026-02-21 02:48:46', 1),
(3, 1, '🦞 Digital Catch', 'Fresh lobster-themed digital items', 'tag', '2026-02-21 02:53:17', 1),
(12, 2, 'Test', 'nope', 'tag', '2026-02-21 02:53:17', 1),
(13, 1, '🎟️ Priority Passes3', 'Restaurant services', 'tag', '2026-02-25 06:43:37', 1);

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `iso_code` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`, `iso_code`) VALUES
(1, 'Afghanistan', 'AF'),
(2, 'Åland Islands', 'AX'),
(3, 'Albania', 'AL'),
(4, 'Algeria', 'DZ'),
(5, 'American Samoa', 'AS'),
(6, 'Andorra', 'AD'),
(7, 'Angola', 'AO'),
(8, 'Anguilla', 'AI'),
(9, 'Antarctica', 'AQ'),
(10, 'Antigua and Barbuda', 'AG'),
(11, 'Argentina', 'AR'),
(12, 'Armenia', 'AM'),
(13, 'Aruba', 'AW'),
(14, 'Australia', 'AU'),
(15, 'Austria', 'AT'),
(16, 'Azerbaijan', 'AZ'),
(17, 'Bahamas', 'BS'),
(18, 'Bahrain', 'BH'),
(19, 'Bangladesh', 'BD'),
(20, 'Barbados', 'BB'),
(21, 'Belarus', 'BY'),
(22, 'Belgium', 'BE'),
(23, 'Belize', 'BZ'),
(24, 'Benin', 'BJ'),
(25, 'Bermuda', 'BM'),
(26, 'Bhutan', 'BT'),
(27, 'Bolivia', 'BO'),
(28, 'Bonaire, Sint Eustatius and Saba', 'BQ'),
(29, 'Bosnia and Herzegovina', 'BA'),
(30, 'Botswana', 'BW'),
(31, 'Bouvet Island', 'BV'),
(32, 'Brazil', 'BR'),
(33, 'British Indian Ocean Territory', 'IO'),
(34, 'Brunei Darussalam', 'BN'),
(35, 'Bulgaria', 'BG'),
(36, 'Burkina Faso', 'BF'),
(37, 'Burundi', 'BI'),
(38, 'Cabo Verde', 'CV'),
(39, 'Cambodia', 'KH'),
(40, 'Cameroon', 'CM'),
(41, 'Canada', 'CA'),
(42, 'Cayman Islands', 'KY'),
(43, 'Central African Republic', 'CF'),
(44, 'Chad', 'TD'),
(45, 'Chile', 'CL'),
(46, 'China', 'CN'),
(47, 'Christmas Island', 'CX'),
(48, 'Cocos (Keeling) Islands', 'CC'),
(49, 'Colombia', 'CO'),
(50, 'Comoros', 'KM'),
(51, 'Congo', 'CG'),
(52, 'Congo, Democratic Republic of the', 'CD'),
(53, 'Cook Islands', 'CK'),
(54, 'Costa Rica', 'CR'),
(55, 'Côte d\'Ivoire', 'CI'),
(56, 'Croatia', 'HR'),
(57, 'Cuba', 'CU'),
(58, 'Curaçao', 'CW'),
(59, 'Cyprus', 'CY'),
(60, 'Czechia', 'CZ'),
(61, 'Denmark', 'DK'),
(62, 'Djibouti', 'DJ'),
(63, 'Dominica', 'DM'),
(64, 'Dominican Republic', 'DO'),
(65, 'Ecuador', 'EC'),
(66, 'Egypt', 'EG'),
(67, 'El Salvador', 'SV'),
(68, 'Equatorial Guinea', 'GQ'),
(69, 'Eritrea', 'ER'),
(70, 'Estonia', 'EE'),
(71, 'Eswatini', 'SZ'),
(72, 'Ethiopia', 'ET'),
(73, 'Falkland Islands (Malvinas)', 'FK'),
(74, 'Faroe Islands', 'FO'),
(75, 'Fiji', 'FJ'),
(76, 'Finland', 'FI'),
(77, 'France', 'FR'),
(78, 'French Guiana', 'GF'),
(79, 'French Polynesia', 'PF'),
(80, 'French Southern Territories', 'TF'),
(81, 'Gabon', 'GA'),
(82, 'Gambia', 'GM'),
(83, 'Georgia', 'GE'),
(84, 'Germany', 'DE'),
(85, 'Ghana', 'GH'),
(86, 'Gibraltar', 'GI'),
(87, 'Greece', 'GR'),
(88, 'Greenland', 'GL'),
(89, 'Grenada', 'GD'),
(90, 'Guadeloupe', 'GP'),
(91, 'Guam', 'GU'),
(92, 'Guatemala', 'GT'),
(93, 'Guernsey', 'GG'),
(94, 'Guinea', 'GN'),
(95, 'Guinea-Bissau', 'GW'),
(96, 'Guyana', 'GY'),
(97, 'Haiti', 'HT'),
(98, 'Heard Island and McDonald Islands', 'HM'),
(99, 'Holy See', 'VA'),
(100, 'Honduras', 'HN'),
(101, 'Hong Kong', 'HK'),
(102, 'Hungary', 'HU'),
(103, 'Iceland', 'IS'),
(104, 'India', 'IN'),
(105, 'Indonesia', 'ID'),
(106, 'Iran', 'IR'),
(107, 'Iraq', 'IQ'),
(108, 'Ireland', 'IE'),
(109, 'Isle of Man', 'IM'),
(110, 'Israel', 'IL'),
(111, 'Italy', 'IT'),
(112, 'Jamaica', 'JM'),
(113, 'Japan', 'JP'),
(114, 'Jersey', 'JE'),
(115, 'Jordan', 'JO'),
(116, 'Kazakhstan', 'KZ'),
(117, 'Kenya', 'KE'),
(118, 'Kiribati', 'KI'),
(119, 'Korea, Democratic People\'s Republic of', 'KP'),
(120, 'Korea, Republic of', 'KR'),
(121, 'Kuwait', 'KW'),
(122, 'Kyrgyzstan', 'KG'),
(123, 'Lao People\'s Democratic Republic', 'LA'),
(124, 'Latvia', 'LV'),
(125, 'Lebanon', 'LB'),
(126, 'Lesotho', 'LS'),
(127, 'Liberia', 'LR'),
(128, 'Libya', 'LY'),
(129, 'Liechtenstein', 'LI'),
(130, 'Lithuania', 'LT'),
(131, 'Luxembourg', 'LU'),
(132, 'Macao', 'MO'),
(133, 'Madagascar', 'MG'),
(134, 'Malawi', 'MW'),
(135, 'Malaysia', 'MY'),
(136, 'Maldives', 'MV'),
(137, 'Mali', 'ML'),
(138, 'Malta', 'MT'),
(139, 'Marshall Islands', 'MH'),
(140, 'Martinique', 'MQ'),
(141, 'Mauritania', 'MR'),
(142, 'Mauritius', 'MU'),
(143, 'Mayotte', 'YT'),
(144, 'Mexico', 'MX'),
(145, 'Micronesia', 'FM'),
(146, 'Moldova', 'MD'),
(147, 'Monaco', 'MC'),
(148, 'Mongolia', 'MN'),
(149, 'Montenegro', 'ME'),
(150, 'Montserrat', 'MS'),
(151, 'Morocco', 'MA'),
(152, 'Mozambique', 'MZ'),
(153, 'Myanmar', 'MM'),
(154, 'Namibia', 'NA'),
(155, 'Nauru', 'NR'),
(156, 'Nepal', 'NP'),
(157, 'Netherlands', 'NL'),
(158, 'New Caledonia', 'NC'),
(159, 'New Zealand', 'NZ'),
(160, 'Nicaragua', 'NI'),
(161, 'Niger', 'NE'),
(162, 'Nigeria', 'NG'),
(163, 'Niue', 'NU'),
(164, 'Norfolk Island', 'NF'),
(165, 'North Macedonia', 'MK'),
(166, 'Northern Mariana Islands', 'MP'),
(167, 'Norway', 'NO'),
(168, 'Oman', 'OM'),
(169, 'Pakistan', 'PK'),
(170, 'Palau', 'PW'),
(171, 'Palestine, State of', 'PS'),
(172, 'Panama', 'PA'),
(173, 'Papua New Guinea', 'PG'),
(174, 'Paraguay', 'PY'),
(175, 'Peru', 'PE'),
(176, 'Philippines', 'PH'),
(177, 'Pitcairn', 'PN'),
(178, 'Poland', 'PL'),
(179, 'Portugal', 'PT'),
(180, 'Puerto Rico', 'PR'),
(181, 'Qatar', 'QA'),
(182, 'Réunion', 'RE'),
(183, 'Romania', 'RO'),
(184, 'Russian Federation', 'RU'),
(185, 'Rwanda', 'RW'),
(186, 'Saint Barthélemy', 'BL'),
(187, 'Saint Helena, Ascension and Tristan da Cunha', 'SH'),
(188, 'Saint Kitts and Nevis', 'KN'),
(189, 'Saint Lucie', 'LC'),
(190, 'Saint Martin (French part)', 'MF'),
(191, 'Saint Pierre and Miquelon', 'PM'),
(192, 'Saint Vincent and the Grenadines', 'VC'),
(193, 'Samoa', 'WS'),
(194, 'San Marino', 'SM'),
(195, 'Sao Tome and Principe', 'ST'),
(196, 'Saudi Arabia', 'SA'),
(197, 'Senegal', 'SN'),
(198, 'Serbia', 'RS'),
(199, 'Seychelles', 'SC'),
(200, 'Sierra Leone', 'SL'),
(201, 'Singapore', 'SG'),
(202, 'Sint Maarten (Dutch part)', 'SX'),
(203, 'Slovakia', 'SK'),
(204, 'Slovenia', 'SI'),
(205, 'Solomon Islands', 'SB'),
(206, 'Somalia', 'SO'),
(207, 'South Africa', 'ZA'),
(208, 'South Georgia and the South Sandwich Islands', 'GS'),
(209, 'South Sudan', 'SS'),
(210, 'Spain', 'ES'),
(211, 'Sri Lanka', 'LK'),
(212, 'Sudan', 'SD'),
(213, 'Suriname', 'SR'),
(214, 'Svalbard and Jan Mayen', 'SJ'),
(215, 'Sweden', 'SE'),
(216, 'Switzerland', 'CH'),
(217, 'Syrian Arab Republic', 'SY'),
(218, 'Taiwan', 'TW'),
(219, 'Tajikistan', 'TJ'),
(220, 'Tanzania, United Republic of', 'TZ'),
(221, 'Thailand', 'TH'),
(222, 'Timor-Leste', 'TL'),
(223, 'Togo', 'TG'),
(224, 'Tokelau', 'TK'),
(225, 'Tonga', 'TO'),
(226, 'Trinidad and Tobago', 'TT'),
(227, 'Tunisia', 'TN'),
(228, 'Turkey', 'TR'),
(229, 'Turkmenistan', 'TM'),
(230, 'Turks and Caicos Islands', 'TC'),
(231, 'Tuvalu', 'TV'),
(232, 'Uganda', 'UG'),
(233, 'Ukraine', 'UA'),
(234, 'United Arab Emirates', 'AE'),
(235, 'United Kingdom', 'GB'),
(236, 'United States', 'US'),
(237, 'United States Minor Outlying Islands', 'UM'),
(238, 'Uruguay', 'UY'),
(239, 'Uzbekistan', 'UZ'),
(240, 'Vanuatu', 'VU'),
(241, 'Venezuela', 'VE'),
(242, 'Viet Nam', 'VN'),
(243, 'Virgin Islands, British', 'VG'),
(244, 'Virgin Islands, U.S.', 'VI'),
(245, 'Wallis and Futuna', 'WF'),
(246, 'Western Sahara', 'EH'),
(247, 'Yemen', 'YE'),
(248, 'Zambia', 'ZM'),
(249, 'Zimbabwe', 'ZW');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `merchant_id` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `onchain_proof_hash` varchar(66) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `transaction_id`, `merchant_id`, `agent_id`, `rating`, `comment`, `onchain_proof_hash`, `created_at`) VALUES
(17, 10, 1, 4, 5, 'Fast fulfillment and high quality. The agent handled the USDC transfer perfectly.', NULL, '2026-02-27 13:53:09');

-- --------------------------------------------------------

--
-- Table structure for table `merchants`
--

CREATE TABLE `merchants` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `business_name` varchar(255) NOT NULL,
  `contact_name` varchar(100) DEFAULT NULL,
  `contact_email` varchar(150) DEFAULT NULL,
  `logo_url` text DEFAULT NULL,
  `business_type_id` int(11) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `physical_address` text DEFAULT NULL,
  `wallet_address` varchar(42) DEFAULT NULL,
  `latitude` text DEFAULT NULL,
  `longitude` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `merchants`
--

INSERT INTO `merchants` (`id`, `user_id`, `business_name`, `contact_name`, `contact_email`, `logo_url`, `business_type_id`, `country_id`, `city`, `physical_address`, `wallet_address`, `latitude`, `longitude`, `is_active`, `created_at`) VALUES
(1, 1, 'Molt Resturant', '', '', '0xd79ab6fa5e747ac92fe751667603a82b55e198127372a8bbde061dea46a9bd1b', 3, 236, 'New York', '', '0x20e229667Cec8A0e9D3C6Fb89693B2a44ec2C50e', '41.33411534', '-72.91992232', 1, '2026-02-21 01:42:43'),
(2, 4, 'Cyberdyne Systems', NULL, NULL, '0xb55c79e39697c9a9a88d52d613ecc401ad63b901f718a228d49d925d7c83b75d', 1, 236, 'New York', NULL, '0x20e229667Cec8A0e9D3C6Fb89693B2a44ec2C50e', '40.71280000', '-74.00600000', 1, '2026-02-21 02:27:52'),
(3, 5, 'Green Leaf Organics', NULL, NULL, '0xb55c79e39697c9a9a88d52d613ecc401ad63b901f718a228d49d925d7c83b75d', 1, 236, 'New York', NULL, NULL, '37.77490000', '-122.41940000', 1, '2026-02-21 02:27:52'),
(5, 1, 'Lob Cafe', '', '', '0x7fb275eab15c8392a63ff39b860a044257a6888f88048d60c2fa2a3a95a70efb', 3, 236, 'New York', '150 west', '0x20e229667Cec8A0e9D3C6Fb89693B2a44ec2C50e', '40.71296098', '-73.97631433', 1, '2026-02-21 03:17:11'),
(6, 4, 'Cyber Punk Cafe', 'Hiro Protagonist', 'hiro@cyber.io', '0xb55c79e39697c9a9a88d52d613ecc401ad63b901f718a228d49d925d7c83b75d', 2, 1, 'Tokyo', 'Shibuya Crossing 2-1', '0x1234567890123456789012345678901234567890', NULL, NULL, 1, '2026-02-21 16:12:34'),
(7, 4, 'Mama Mia Pizza', 'Mario Rossi', 'orders@mamamia.com', '0xb55c79e39697c9a9a88d52d613ecc401ad63b901f718a228d49d925d7c83b75d', 1, 1, 'New York', '123 Broadway St', '0xAbcdef1234567890abcdef1234567890abcdef12', '40.71802722', '-73.98620783', 1, '2026-02-21 16:12:34');

-- --------------------------------------------------------

--
-- Table structure for table `merchant_types`
--

CREATE TABLE `merchant_types` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `merchant_types`
--

INSERT INTO `merchant_types` (`id`, `name`, `description`) VALUES
(1, 'Retail & General Stores', 'Direct-to-consumer physical goods and everyday items'),
(2, 'Wholesale & Distribution', 'Bulk inventory and B2B supply chain management'),
(3, 'Food & Beverage', 'Restaurants, cafes, and catering services'),
(4, 'Grocery & Supermarkets', 'Fresh produce, household supplies, and essentials'),
(5, 'Hardware & Construction', 'Tools, building materials, and industrial supplies'),
(6, 'Electronics & Gadgets', 'Consumer electronics, appliances, and hardware components'),
(7, 'Maintenance & Repair', 'Technical repairs, plumbing, electrical, and logic services'),
(8, 'Healthcare & Pharmacy', 'Medical supplies, health services, and automated pharmacy'),
(9, 'Education & Training', 'Online courses, certifications, and skill development'),
(10, 'Legal & Compliance', 'Smart contract auditing, legal logic, and regulatory services'),
(11, 'Financial Services', 'DeFi liquidity, credit lines, and wealth management'),
(12, 'Travel & Transport', 'Autonomous vehicle booking, flights, and logistics'),
(13, 'Digital Goods & Software', 'Software licenses, API keys, and digital assets'),
(14, 'Cloud & Data Storage', 'Server nodes, decentralized storage, and hosting'),
(15, 'AI & Compute Nodes', 'GPU rental, LLM inference, and neural network training'),
(16, 'Oracle & Data Feeds', 'Real-world data delivery and blockchain verification'),
(17, 'Cybersecurity & Privacy', 'Encryption services, VPNs, and identity protection'),
(18, 'Marketing & Advertising', 'Agent-to-agent referrals and autonomous ad networks'),
(19, 'Autonomous Logistics', 'Drone delivery, automated fleet, and warehouse robotics'),
(20, 'Energy & Utilities', 'Renewable energy trading, grid management, and power'),
(21, 'Identity & Reputation', 'DID providers and agent trust scoring systems'),
(22, 'Arbitration & Escrow', 'Conflict resolution and multisig payment holding'),
(23, 'IoT Sensor Networks', 'Real-world data providers for automated triggers'),
(24, 'DAO & Governance', 'Treasury management and organizational governance nodes'),
(25, 'Real Estate & Land', 'Property management and automated leasing protocols'),
(26, 'Media & Entertainment', 'Content licensing, gaming, and digital art distribution'),
(27, 'Insurance & Risk', 'Automated hedging and smart contract coverage'),
(28, 'Research & Development', 'Scientific data, lab services, and intellectual property'),
(29, 'Non-Profit & Impact', 'Charitable organizations and social impact initiatives'),
(30, 'General Service Provider', 'Versatile service providers not fitting other categories');

-- --------------------------------------------------------

--
-- Table structure for table `nonces`
--

CREATE TABLE `nonces` (
  `id` int(11) NOT NULL,
  `nonce` varchar(64) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `wallet_address` varchar(42) DEFAULT NULL,
  `entity_type` enum('agent','merchant') NOT NULL DEFAULT 'merchant',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nonces`
--

INSERT INTO `nonces` (`id`, `nonce`, `ip_address`, `wallet_address`, `entity_type`, `created_at`, `expires_at`) VALUES
(24, 'f3ac6190cd39ea27a058f8d835d50a97', '::1', NULL, 'agent', '2026-02-22 00:02:31', '2026-02-22 03:37:31'),
(25, '65fafc6bea730fa461c163ae4ae8acb6', '::1', NULL, 'agent', '2026-02-22 00:08:11', '2026-02-22 03:43:11'),
(26, '0fd479f4ec71537b873f920a38fc34c7', '::1', NULL, 'agent', '2026-02-22 00:08:38', '2026-02-22 03:43:38'),
(27, '6f313fb60e3b7d2710b6e76f9cf5d771', '::1', NULL, 'agent', '2026-02-22 00:18:15', '2026-02-22 03:53:15'),
(32, '2447c1af763850d4b8c11e08763b2fb2', '::1', NULL, 'agent', '2026-02-23 06:08:35', '2026-02-23 09:43:35'),
(33, '00dd8b24aa5e66c1a8492847825c58b7', '::1', NULL, 'agent', '2026-02-23 06:15:49', '2026-02-23 09:50:49'),
(34, '4eed2fca2825653f8cd363c0552279f8', '::1', NULL, 'agent', '2026-02-23 06:16:38', '2026-02-23 09:51:38'),
(38, '4cc94e9362e66791f20da98c7d4a4120', '::ffff:127.0.0.1', NULL, 'agent', '2026-02-25 03:07:55', '2026-02-25 06:42:55'),
(41, '87ae7c7f346f529b09313603d9dd4eae', '::1', NULL, 'agent', '2026-02-26 04:04:39', '2026-02-26 07:39:39'),
(47, '055c03b09151d34c929f1244da7da650', '::1', NULL, 'agent', '2026-02-27 04:12:28', '2026-02-27 07:47:28'),
(48, '97dcc05c46e74d61be64ac94d1f33230', '::1', NULL, 'agent', '2026-02-27 04:48:29', '2026-02-27 08:23:29'),
(49, '2ad85656d5688ad74c1985be53d92f12', '::1', NULL, 'agent', '2026-02-27 04:48:39', '2026-02-27 08:23:39'),
(51, '433242035cfa5f4f330190dcc73b6146', '::1', NULL, 'agent', '2026-02-27 04:50:15', '2026-02-27 08:25:15'),
(53, '8afc31d350886a1e33d8e4b00882d774', '::1', NULL, 'agent', '2026-02-27 08:59:51', '2026-02-27 12:34:51'),
(54, '55c1cc8209c6dbd446d309b663f67700', '::1', NULL, 'agent', '2026-02-27 09:40:47', '2026-02-27 13:15:47');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `merchant_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(20,8) NOT NULL,
  `delivery_minutes` int(11) DEFAULT 0,
  `stock_quantity` int(11) DEFAULT 0,
  `image_url` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `merchant_id`, `category_id`, `name`, `description`, `price`, `delivery_minutes`, `stock_quantity`, `image_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Golden Claw Ticket', 'A rare digital collectible for the Lobster Shack. Includes a \"Certified Fisher\" badge 🎖️.', 2.00000000, 120, 100, '0xa52b533a9371f85774bb0eb8b3ebb7d88cdfe968c1d217901fcae62801bd0157', 1, '2026-02-21 01:42:43', '2026-05-02 23:35:02'),
(2, 1, 13, 'Crypto Cocktail', 'A glowing virtual drink with a neon lime slice. Sends a 🍸 emoji to your wallet memo.', 1.50000000, 0, 100, '0xec9ccdaac24ff6c3b4601fa5cdc30e73fbab11da2e0b58fb79ccf5ebb093a5aa', 1, '2026-02-21 01:42:43', '2026-05-02 23:35:27'),
(7, 1, 3, 'Mainnet Maine Lobster', 'A high-resolution 3D lobster asset. Purchasing this triggers a virtual feast message 🦞.', 1.00000000, 0, 100, '0xf16b0dd74641188a9effdeeda3c6244822033b4b85dea7bf7cecdebf0ac81d28', 1, '2026-02-21 16:27:20', '2026-05-02 23:34:28');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `merchant_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `amount` decimal(20,8) NOT NULL,
  `transaction_hash` varchar(66) DEFAULT NULL,
  `status` enum('pending','confirmed','failed') DEFAULT 'pending',
  `delivery_address` text DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `delivery_notes` text DEFAULT NULL,
  `delivery_status` enum('preparing','shipped','delivered','picked_up') DEFAULT 'preparing',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `merchant_id`, `agent_id`, `amount`, `transaction_hash`, `status`, `delivery_address`, `customer_phone`, `delivery_notes`, `delivery_status`, `created_at`) VALUES
(10, 1, 4, 1.00000000, '0xcbf63969211234ddc6dd13dba1feb54aa4c8ab9fa7a949095df998037878abff', 'confirmed', NULL, NULL, NULL, 'picked_up', '2026-02-23 22:51:35'),
(11, 1, 4, 1.00000000, '0x935a6301ca982f80aaf2eb311ad2cecf8cb24b8e4b15f8b576d49cad17817937', 'confirmed', NULL, NULL, NULL, 'picked_up', '2026-02-24 07:48:20'),
(12, 1, 4, 1.00000000, '0x35c9181457357cc8209ede7cd51ed3ccdd388078d014c3c1d44917bf758ee23d', 'confirmed', 'Istanbul, Turkey', '+999123456789', 'Leave at the main entrance', 'shipped', '2026-02-27 14:37:49');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_items`
--

CREATE TABLE `transaction_items` (
  `id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price_at_purchase` decimal(20,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction_items`
--

INSERT INTO `transaction_items` (`id`, `transaction_id`, `product_id`, `quantity`, `price_at_purchase`) VALUES
(5, 10, 1, 1, 1.00000000),
(6, 11, 1, 1, 1.00000000),
(7, 12, 7, 1, 1.00000000);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `wallet_address` varchar(42) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `profile_image` varchar(512) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `wallet_address`, `name`, `profile_image`, `created_at`) VALUES
(1, '0x20e229667cec8a0e9d3c6fb89693b2a44ec2c50e', 'atenyun', 'https://pbs.twimg.com/profile_images/2024604016966017024/dABkshRM_400x400.jpg', '2026-02-21 01:08:20'),
(4, '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 'Cyberdyne CEO', 'https://api.dicebear.com/7.x/avataaars/svg?seed=cyber', '2026-02-21 02:27:52'),
(5, '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'Green Leaf Admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=green', '2026-02-21 02:27:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agents`
--
ALTER TABLE `agents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wallet_address` (`wallet_address`),
  ADD UNIQUE KEY `api_key` (`api_key`),
  ADD KEY `api_key_2` (`api_key`),
  ADD KEY `idx_erc8004` (`erc8004_identity`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `merchant_id` (`merchant_id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_id` (`transaction_id`),
  ADD KEY `agent_id` (`agent_id`),
  ADD KEY `merchant_id` (`merchant_id`),
  ADD KEY `rating` (`rating`);

--
-- Indexes for table `merchants`
--
ALTER TABLE `merchants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `business_type_id` (`business_type_id`),
  ADD KEY `fk_merchants_country` (`country_id`);

--
-- Indexes for table `merchant_types`
--
ALTER TABLE `merchant_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nonces`
--
ALTER TABLE `nonces`
  ADD PRIMARY KEY (`id`),
  ADD KEY `wallet_address` (`wallet_address`),
  ADD KEY `nonce` (`nonce`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `merchant_id` (`merchant_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_hash` (`transaction_hash`),
  ADD KEY `merchant_id` (`merchant_id`),
  ADD KEY `agent_id` (`agent_id`);

--
-- Indexes for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_items_transaction` (`transaction_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wallet_address` (`wallet_address`),
  ADD KEY `wallet_address_2` (`wallet_address`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agents`
--
ALTER TABLE `agents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=250;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `merchants`
--
ALTER TABLE `merchants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `merchant_types`
--
ALTER TABLE `merchant_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `nonces`
--
ALTER TABLE `nonces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `transaction_items`
--
ALTER TABLE `transaction_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`merchant_id`) REFERENCES `merchants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`merchant_id`) REFERENCES `merchants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedback_ibfk_3` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `merchants`
--
ALTER TABLE `merchants`
  ADD CONSTRAINT `fk_merchants_country` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`),
  ADD CONSTRAINT `merchants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `merchants_ibfk_2` FOREIGN KEY (`business_type_id`) REFERENCES `merchant_types` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`merchant_id`) REFERENCES `merchants` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`merchant_id`) REFERENCES `merchants` (`id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`);

--
-- Constraints for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD CONSTRAINT `fk_items_transaction` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transaction_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
