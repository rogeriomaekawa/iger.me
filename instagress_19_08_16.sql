-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 19-Ago-2016 às 20:02
-- Versão do servidor: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `instagress`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `auto_stop_settings`
--

CREATE TABLE IF NOT EXISTS `auto_stop_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `likes_counter` int(11) DEFAULT NULL,
  `comments_counter` int(11) DEFAULT NULL,
  `follows_counter` int(11) DEFAULT NULL,
  `unfollows_counter` int(11) DEFAULT NULL,
  `timer` int(11) DEFAULT NULL,
  `stop_no_user` tinyint(4) DEFAULT NULL,
  `users_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_auto_stop_settings_users1_idx` (`users_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `alias` varchar(100) DEFAULT NULL,
  `users_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_comments_users1_idx` (`users_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `main_settings`
--

CREATE TABLE IF NOT EXISTS `main_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_speed` tinyint(4) DEFAULT NULL,
  `media_source` tinyint(4) DEFAULT NULL,
  `new_media_only` tinyint(4) DEFAULT NULL,
  `min_likes_filter` int(11) DEFAULT NULL,
  `max_likes_filter` int(11) DEFAULT NULL,
  `comment_same_users` tinyint(4) DEFAULT NULL,
  `unfollow_source` tinyint(4) DEFAULT NULL,
  `unfollow_not_follow_me` tinyint(4) DEFAULT NULL,
  `users_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_main_settings_users1_idx` (`users_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tags`
--

CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `alias` varchar(100) DEFAULT NULL,
  `users_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tags_users_idx` (`users_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `hash` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `expired_date` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `created` int(11) DEFAULT NULL,
  `modified` int(11) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `access_token` varchar(100) DEFAULT NULL,
  `instagram_id` int(11) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `facebook_id` int(100) DEFAULT NULL,
  `avatar` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=66 ;

--
-- Extraindo dados da tabela `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `hash`, `email`, `type`, `expired_date`, `status`, `created`, `modified`, `full_name`, `access_token`, `instagram_id`, `google_id`, `facebook_id`, `avatar`) VALUES
(26, NULL, '4297f44b13955235245b2497399d7a93', NULL, 'kien123@gmail.com', NULL, NULL, NULL, 1411033475, NULL, NULL, NULL, NULL, NULL, NULL, '0'),
(28, NULL, '4297f44b13955235245b2497399d7a93', NULL, 'kien12333@gmail.com', NULL, NULL, NULL, 1411034018, NULL, NULL, NULL, NULL, NULL, NULL, '0'),
(29, NULL, '4297f44b13955235245b2497399d7a93', NULL, 'kien1234@gmail.com', NULL, NULL, NULL, 1411093137, NULL, NULL, NULL, NULL, NULL, NULL, '0'),
(41, NULL, '202cb962ac59075b964b07152d234b70', NULL, 'kien1231111@gmail.com', NULL, NULL, NULL, 1411101547, NULL, NULL, NULL, NULL, NULL, NULL, '0'),
(42, NULL, 'c4ca4238a0b923820dcc509a6f75849b', NULL, 'kien12311111@gmail.com', NULL, NULL, NULL, 1411101560, NULL, NULL, NULL, NULL, NULL, NULL, '0'),
(43, NULL, '4297f44b13955235245b2497399d7a93', NULL, 'kien12311111111@gmail.com', NULL, NULL, NULL, 1411113141, NULL, NULL, NULL, NULL, NULL, NULL, '0'),
(44, NULL, '4297f44b13955235245b2497399d7a93', NULL, 'hoangff@gmail.com', NULL, NULL, NULL, 1411351077, NULL, NULL, NULL, NULL, NULL, NULL, '0'),
(45, NULL, '4297f44b13955235245b2497399d7a93', NULL, 'hoang1@gmail.com', NULL, NULL, NULL, 1411351222, NULL, NULL, NULL, NULL, NULL, NULL, '0'),
(47, NULL, '4297f44b13955235245b2497399d7a93', NULL, 'abc@gmail.com', NULL, NULL, NULL, 1411360330, NULL, NULL, NULL, NULL, NULL, NULL, '0'),
(48, NULL, '$2a$13$DcOtrOZSNOQdhtnOV9t/ie2GnqlM63ylFTvCkcltzMhZv4ShZZkGy', NULL, 'abc1@gmail.com', NULL, NULL, NULL, 1411362393, NULL, NULL, NULL, NULL, NULL, NULL, '0'),
(49, NULL, '$2a$13$N9J7aRIPcgJAJVU6MY3VeOo7SznLdNoxORGjsx2.pJahP28oKBNEu', NULL, 'abc2@gmail.com', NULL, NULL, NULL, 1411372860, NULL, NULL, NULL, NULL, NULL, NULL, '0'),
(50, 'modibixa0', '$2a$13$jkGDHM6hYrmKfe5zn2niduzO5wC0rRnPor1cuBmqJRjK2Nkrp/eRS', NULL, NULL, NULL, 1411726595, NULL, 1411377976, 1411467395, 'modi', '1474650842.db64ea1.bf5d0589f68e4a3c9c689fefe6a16c38', 1474650842, NULL, NULL, 'http://images.ak.instagram.com/profiles/anonymousUser.jpg'),
(51, 'softdevelopinc', '$2a$13$LMbzERQ9JQQOnTO1GFDD1O4zTKClHOiTt63.iI2XuFBWvVD0T8BPO', NULL, NULL, NULL, NULL, NULL, 1411379630, NULL, 'duong', '1474648557.db64ea1.445d61d13c8141a88b27a8fdb4012531', 1474648557, NULL, NULL, 'http://images.ak.instagram.com/profiles/anonymousUser.jpg'),
(52, NULL, '$2a$13$8hr.Ek43z/xMaHdeT/0tDeEQ/EAEaivyyuExRBiB6xwckV61YxAkO', NULL, 'rogeriomesmo@hotmail.com', NULL, NULL, NULL, 1471440169, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(56, 'rogeriomaekawa', '$2a$13$T0yr0/NrpKTO02Py/Dknzu.gFGR3BKx0nSxcIVMfllYU6krTiX.i.', NULL, NULL, NULL, NULL, NULL, 1471441008, NULL, 'Rogerio Maekawa', '3619345122.b0d1a8a.6aaccceb4fbc4bde82aab77cff9f60c2', 2147483647, NULL, NULL, 'https://scontent.cdninstagram.com/t51.2885-19/11906329_960233084022564_1448528159_a.jpg'),
(57, 'rogeriomaekawa', '$2a$13$DkLbVyk7SzfCNL11JIgOt.bfufwbIyR6is0SOEQkzvsYyQbWfx5.q', NULL, NULL, NULL, NULL, NULL, 1471441171, NULL, 'Rogerio Maekawa', '3619345122.b0d1a8a.6aaccceb4fbc4bde82aab77cff9f60c2', 2147483647, NULL, NULL, 'https://scontent.cdninstagram.com/t51.2885-19/11906329_960233084022564_1448528159_a.jpg'),
(58, 'rogeriomaekawa', '$2a$13$VOeepwI3ZFZvnkDCAaF.8Ohq9xFWV8ZNk606uQnpKl/fjCZnWLF5q', NULL, NULL, NULL, NULL, NULL, 1471441222, NULL, 'Rogerio Maekawa', '3619345122.b0d1a8a.6aaccceb4fbc4bde82aab77cff9f60c2', 2147483647, NULL, NULL, 'https://scontent.cdninstagram.com/t51.2885-19/11906329_960233084022564_1448528159_a.jpg'),
(59, 'rogeriomaekawa', '$2a$13$KaD8JtAtgu90hZWpR2jBK./z9.hiZps12cQICr.dN6UVHYGITIsHy', NULL, NULL, NULL, NULL, NULL, 1471443652, NULL, 'Rogerio Maekawa', '3619345122.b0d1a8a.6aaccceb4fbc4bde82aab77cff9f60c2', 2147483647, NULL, NULL, 'https://scontent.cdninstagram.com/t51.2885-19/11906329_960233084022564_1448528159_a.jpg'),
(60, 'rogeriomaekawa', '$2a$13$2ALuF5FEg180l/OU4FGXXeCGb2iIox4bJrkjnljDV53eg6WApRo4.', NULL, NULL, NULL, NULL, NULL, 1471443756, NULL, 'Rogerio Maekawa', '3619345122.b0d1a8a.6aaccceb4fbc4bde82aab77cff9f60c2', 2147483647, NULL, NULL, 'https://scontent.cdninstagram.com/t51.2885-19/11906329_960233084022564_1448528159_a.jpg'),
(61, 'rogeriomaekawa', '$2a$13$ttvJ8o3i7fZA.A6UHjJYL.XiFdkDkozWIIOZdd2FWmGPwd/drOGaS', NULL, NULL, NULL, NULL, NULL, 1471461285, NULL, 'Rogerio Maekawa', '3619345122.b0d1a8a.6aaccceb4fbc4bde82aab77cff9f60c2', 2147483647, NULL, NULL, 'https://scontent.cdninstagram.com/t51.2885-19/11906329_960233084022564_1448528159_a.jpg'),
(62, 'rogeriomaekawa', '$2a$13$u2At41kj4UyeuCUBU7gSAe672Ki3CNk51TDMLHL0T/XLkOaL4DqZ.', NULL, NULL, NULL, NULL, NULL, 1471461373, NULL, 'Rogerio Maekawa', '3619345122.b0d1a8a.6aaccceb4fbc4bde82aab77cff9f60c2', 2147483647, NULL, NULL, 'https://scontent.cdninstagram.com/t51.2885-19/11906329_960233084022564_1448528159_a.jpg'),
(64, 'rogeriomaekawa@gmail.com', '$2a$13$5dOaD.tpE9P1lgDzz/y93.dHJ5kUFOtqor8AqcvkAfuGgX0o2IO8G', NULL, 'rogeriomaekawa@gmail.com', NULL, NULL, NULL, 1471616286, NULL, 'Rogerio Maekawa', NULL, NULL, '107528413475368128574', NULL, 'https://lh6.googleusercontent.com/-se1tu6kdE_I/AAAAAAAAAAI/AAAAAAAAAM4/cC9YpV4XGhI/photo.jpg'),
(65, 'MkInoue Desenvolvimento', '$2a$13$19bSWlMYLrMngp.5qR2aoOAvEdZ1EzTAUClXw/7IEpSmpAfVW5wsO', NULL, 'facebooklogin@login.com.br', NULL, NULL, NULL, 1471622353, NULL, NULL, NULL, NULL, NULL, 2147483647, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_child`
--

CREATE TABLE IF NOT EXISTS `user_child` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_child_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_child_user1_idx` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=19 ;

--
-- Extraindo dados da tabela `user_child`
--

INSERT INTO `user_child` (`id`, `user_child_id`, `user_id`) VALUES
(17, 51, 48),
(18, 50, 48);

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `auto_stop_settings`
--
ALTER TABLE `auto_stop_settings`
  ADD CONSTRAINT `fk_auto_stop_settings_users1` FOREIGN KEY (`users_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_users1` FOREIGN KEY (`users_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `main_settings`
--
ALTER TABLE `main_settings`
  ADD CONSTRAINT `fk_main_settings_users1` FOREIGN KEY (`users_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `tags`
--
ALTER TABLE `tags`
  ADD CONSTRAINT `fk_tags_users` FOREIGN KEY (`users_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `user_child`
--
ALTER TABLE `user_child`
  ADD CONSTRAINT `fk_user_child_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
