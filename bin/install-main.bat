set VERSION=1.0.0
call pnpm run build-only
call jar cvf cloud-platform-ui-%VERSION%.jar -C dist .
call mvn install:install-file -DgroupId=com.byteasy -DartifactId=cloud-platform-ui -Dversion=%VERSION% -Dpackaging=jar -Dfile=cloud-platform-ui-%VERSION%.jar
call del cloud-platform-ui-%VERSION%.jar
