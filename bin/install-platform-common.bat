set VERSION=1.0.0
set APP_NAME=cloud-platform-common-ui
call pnpm run build-only
call jar cvf %APP_NAME%-%VERSION%.jar -C dist .
call mvn install:install-file -DgroupId=com.tuna -DartifactId=%APP_NAME% -Dversion=%VERSION% -Dpackaging=jar -Dfile=%APP_NAME%-%VERSION%.jar
call del %APP_NAME%-%VERSION%.jar
