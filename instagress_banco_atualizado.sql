-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 26-Ago-2016 às 01:16
-- Versão do servidor: 10.1.13-MariaDB
-- PHP Version: 5.5.37

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `instagress`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `auto_stop_settings`
--

CREATE TABLE `auto_stop_settings` (
  `id` int(11) NOT NULL,
  `likes_counter` int(11) DEFAULT NULL,
  `comments_counter` int(11) DEFAULT NULL,
  `follows_counter` int(11) DEFAULT NULL,
  `unfollows_counter` int(11) DEFAULT NULL,
  `timer` int(11) DEFAULT NULL,
  `stop_no_user` tinyint(4) DEFAULT NULL,
  `users_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `alias` varchar(100) DEFAULT NULL,
  `users_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `main_settings`
--

CREATE TABLE `main_settings` (
  `id` int(11) NOT NULL,
  `activity_speed` tinyint(4) DEFAULT NULL,
  `media_source` tinyint(4) DEFAULT NULL,
  `new_media_only` tinyint(4) DEFAULT NULL,
  `min_likes_filter` int(11) DEFAULT NULL,
  `max_likes_filter` int(11) DEFAULT NULL,
  `comment_same_users` tinyint(4) DEFAULT NULL,
  `unfollow_source` tinyint(4) DEFAULT NULL,
  `unfollow_not_follow_me` tinyint(4) DEFAULT NULL,
  `users_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `alias` varchar(100) DEFAULT NULL,
  `users_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
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
  `avatar` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_child`
--

CREATE TABLE `user_child` (
  `id` int(11) NOT NULL,
  `user_child_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auto_stop_settings`
--
ALTER TABLE `auto_stop_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_auto_stop_settings_users1_idx` (`users_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comments_users1_idx` (`users_id`);

--
-- Indexes for table `main_settings`
--
ALTER TABLE `main_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_main_settings_users1_idx` (`users_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tags_users_idx` (`users_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_child`
--
ALTER TABLE `user_child`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_child_user1_idx` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auto_stop_settings`
--
ALTER TABLE `auto_stop_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `main_settings`
--
ALTER TABLE `main_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;
--
-- AUTO_INCREMENT for table `user_child`
--
ALTER TABLE `user_child`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
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
