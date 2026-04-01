set VERSION=1.0.0
set APP_NAME=cloud-platform-common
call jar cvf %APP_NAME%-ui-%VERSION%.jar -C dist .
call mvn install:install-file -DgroupId=com.tuna -DartifactId=%APP_NAME%-ui -Dversion=%VERSION% -Dpackaging=jar -Dfile=%APP_NAME%-ui-%VERSION%.jar
call del %APP_NAME%-ui-%VERSION%.jar
