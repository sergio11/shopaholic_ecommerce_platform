task default: %w[ecommerce:deploy]

namespace :ecommerce do

	desc "Authenticating with existing credentials"
	task :login do
		puts `docker login 2>&1`
	end

	desc "Cleaning Environment Task"
	task :cleaning_environment_task do
		puts "Cleaning Environment"
		puts `docker image prune -af`
		puts `docker volume prune -f 2>&1`
	end

	desc "Status Containers"
	task :status do
		puts "Show Containers Status"
		puts `docker-compose ps 2>&1`
	end

	desc "Deploys Platform Containers and launches all services and daemons needed to properly work"
	task :deploy => [
		:cleaning_environment_task,
		"platform:start",
		:status] do
	    puts "Deploying services..."
	end

	desc "Undeploy Platform Containers"
	task :undeploy => [ :status ] do
		puts "Undeploy Services"
		puts `docker-compose down -v 2>&1`
	end


	desc "Check Docker and Docker Compose Task"
	task :check_docker_task do
		puts "Check Docker and Docker Compose ..."
		if which('docker') && which('docker-compose')
			show_docker_version
			show_docker_compose_version
		else
			raise "Please check that Docker and Docker Compose are visible and accessible in the PATH"
		end
	end


    ## Deploy MariaDB Galera Cluster with ProxySQL
	namespace :galera do

	        desc "Check Platform Deployment File"
    		task :check_deployment_file do
    			puts "Check Platform Deployment File ..."
    			raise "Deployment file not found, please check availability" unless File.file?("./mariadb_galera_cluster/docker-compose.yml")
    			puts "Platform Deployment File OK!"
    		end

    		desc "Start MariaDB Galera Cluster and ProxySQL containers"
            task :start => [ :check_docker_task, :login, :check_deployment_file ] do
                puts "Start MariaDB Galera Cluster and ProxySQL containers"
            	puts `docker-compose -f ./mariadb_galera_cluster/docker-compose.yml up -d`
            end

            desc "Stop MariaDB Galera Cluster and ProxySQL containers"
            task :stop => [ :check_docker_task, :login, :check_deployment_file  ] do
            	puts "Stop Platform Containers"
            	puts `docker-compose -f ./mariadb_galera_cluster/docker-compose.yml stop 2>&1`
            end

	end

	## Utils Functions

	def show_docker_version
	  puts `docker version 2>&1`
	end

	def show_docker_compose_version
	  puts `docker-compose version 2>&1`
	end

	# Cross-platform way of finding an executable in the $PATH.
	# which('ruby') #=> /usr/bin/ruby
	def which(cmd)
	  exts = ENV['PATHEXT'] ? ENV['PATHEXT'].split(';') : ['']
	  ENV['PATH'].split(File::PATH_SEPARATOR).each do |path|
	    exts.each { |ext|
	      exe = File.join(path, "#{cmd}#{ext}")
	      return exe if File.executable?(exe) && !File.directory?(exe)
	    }
	  end
	  return nil
	end

end
