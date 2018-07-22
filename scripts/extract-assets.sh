# This step is needed for S3 to find the assets in the root of the bucket and the 
# to avoid breaking the local references

cp -Rv dist/track-change-simplyimpactful/ dist
rm -r dist/track-change-simplyimpactful
