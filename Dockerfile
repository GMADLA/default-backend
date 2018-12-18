FROM cloudposse/packages:0.2.1 as packages
FROM nginx:1.15.0-alpine

ENV HOMEPAGE=https://www.globelifeinsurance.com/
ENV EMAIL=GlobeWebMgmt@Globelifeins.com

COPY --from=packages /packages/bin/gomplate /usr/bin/

ADD rootfs/ /

CMD ["gomplate", "--input-dir", "/usr/share/nginx/html/", "--output-dir", "/usr/share/nginx/html/", "--", "nginx", "-g", "daemon off;"]
